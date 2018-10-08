import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    withTheme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Api from '../../Api/api';
import { Checkpoints } from '../../Components/Checkpoints/Checkpoints';
import { IProject } from '../../Models/project';
import { IProjectCreationProjectUser } from '../../Models/projectUser';
import { getInitialCheckpoints, setProjectNameCreator, updateProjectUserActionCreator } from '../../Redux/ActionCreators/projectCreationActionCreators';
import { addProjectUserActionCreator } from '../../Redux/ActionCreators/projectCreationActionCreators';
import { IAppState } from '../../Redux/Reducers/rootReducer';
import { handleChange } from '../../Utils/handleChange';
import {
    createProjectCreationClasses,
    IProjectCreationProps,
    IProjectCreationState,
} from './ProjectCreation.ias';

export class ProjectCreationPresentation extends React.Component<IProjectCreationProps, IProjectCreationState> {
    public state = {
        open: false,
        activeStep: 0,
        projectName: '',
        checkpoints: [],
        user: '',
        checkpointStatus: '',
        role: '',
        additionalCheckpoints: new Set<string>([]),
        isUpdate: false,
        index: -1,
    };

    public handleChange = handleChange(this);

    public handleProjectNameChange = (event: any) => {
        // tslint:disable-next-line:no-console
        const projectName = event.target.value;
        this.props.updateProjectName(projectName);
    }

    public componentWillMount() {
        this.props.getInitialProjectCreationCheckpoints();
    }

    public render() {
        const {
            projectCreationContainer,
            stepperContainer,
            topBar,
            topBarContainer,
            fullWidthPaper,
        } = createProjectCreationClasses(this.props, this.state);

        return (
            <div className={projectCreationContainer}>
                <div className={topBarContainer}>
                    <div className={topBar}>
                        <Paper className={fullWidthPaper}>
                            <Stepper activeStep={this.state.activeStep} className={stepperContainer}>
                                <Step>
                                    <StepLabel>Project Name</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>Add Checkpoints</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>Add Users</StepLabel>
                                </Step>
                            </Stepper>
                            <div>
                                {this.createActionButtons()}
                            </div>
                        </Paper>
                    </div>
                </div>
                {this.getStepActiveContent()}
            </div>
        )
    }

    private onNextClick = () => {
        this.setState({
            activeStep: this.state.activeStep + 1,
        })
    }

    private onBackClick = () => {
        this.setState({
            activeStep: this.state.activeStep - 1,
        })
    }

    private createProject = () => {
        const projectToCreate: IProject = {
            id: Date.now().toString(),
            name: '',
            checkpoints: this.state.checkpoints,
            users: [],
            complete: false,
        };
        Api.projectsApi.createProject('does not matter', projectToCreate);
    }

    private createActionButtons(): any {
        const {
            actionButtonContainer,
            baseActionButton,
        } = createProjectCreationClasses(this.props, this.state);

        const backButton = this.state.activeStep !== 0 ? (
            <Button
                className={baseActionButton}
                variant="contained"
                onClick={this.onBackClick}
                color="secondary">
                Back
            </Button>
        ) : undefined;

        const nextButton = this.state.activeStep !== 2 ? (
            <Button
                className={baseActionButton}
                variant="contained"
                onClick={this.onNextClick}
                color="secondary">
                Next
            </Button>
        ) : undefined;

        const saveButton = this.state.activeStep === 2 ? (
            <Button
                className={baseActionButton}
                variant="contained"
                onClick={this.createProject}
                color="secondary">
                Create Project
            </Button>
        ) : undefined;

        return (
        <div className={actionButtonContainer}>
            {backButton}
            {nextButton}
            {saveButton}
        </div>
        )
    }

    private handleClose = (): void => {
        this.setState({
            open: false,
        });

        setTimeout(() => {
            this.setState({
                checkpoints: [],
                user: '',
                checkpointStatus: '',
                role: '',
            });
        });
    }

    private openUserDialog = (): void => {
        this.setState({
            open: true,
            index: -1,
            isUpdate: false,
            checkpointStatus: '',
            additionalCheckpoints: new Set([]),
        });
    }

    private updateUserDialog = (index: number): () => void => {
        const user = this.props.projectCreation.projectUsers[index];
        
        let additionalCheckpoints: Set<string>;

        if (user.checkpointModifier === 'AllCheckpointsExcept') {
            const newCheckpointsArray = this.props.projectCreation.checkpoints.filter((checkpoint) => {
                return !user.checkpoints.has(checkpoint.name);
            }).map((checkpoint) => checkpoint.name);
            additionalCheckpoints = new Set(newCheckpointsArray);
        } else {
            additionalCheckpoints = this.state.additionalCheckpoints;
        }

        return () => {
            this.setState({
                open: true,
                index,
                isUpdate: true,
                checkpointStatus: user.checkpointModifier,
                additionalCheckpoints,
            })
        }
    }

    private addUserToProject = (): void => {
        let checkpoints: Set<string>;
        if (this.state.checkpointStatus === 'AllCheckpointsExcept') {
            const newCheckpointsArray = this.props.projectCreation.checkpoints.filter((checkpoint) => {
                return !this.state.additionalCheckpoints.has(checkpoint.name);
            }).map((checkpoint) => checkpoint.name);
            checkpoints = new Set(newCheckpointsArray);
        } else {
            checkpoints = this.state.additionalCheckpoints;
        }

        const projectUser: IProjectCreationProjectUser = {
            userId: '5',
            email: 'bob@bob.com',
            name: this.state.user,
            type: 'Admin',
            checkpoints,
            checkpointModifier: this.state.checkpointStatus as any,
        }
        this.props.addProjectUser(projectUser);
        this.setState({
            open: false,
        })
    }

    private updateProjectUser = (): void => {
        let checkpoints: Set<string>;
        if (this.state.checkpointStatus === 'AllCheckpointsExcept') {
            const newCheckpointsArray = this.props.projectCreation.checkpoints.filter((checkpoint) => {
                return !this.state.additionalCheckpoints.has(checkpoint.name);
            }).map((checkpoint) => checkpoint.name);
            checkpoints = new Set(newCheckpointsArray);
        } else {
            checkpoints = this.state.additionalCheckpoints;
        }

        const projectUser: IProjectCreationProjectUser = {
            userId: '5',
            email: 'bob@bob.com',
            name: this.state.user,
            type: 'Admin',
            checkpoints,
            checkpointModifier: this.state.checkpointStatus as any,
        }
        this.props.updateProjectUser(projectUser, this.state.index);
        this.setState({
            open: false,
        })
    }

    private handleAdditionalCheckpoint = (event: any): any => {
        const clonedSet = new Set(this.state.additionalCheckpoints);
        clonedSet.add(event.target.value);
        this.setState({
            additionalCheckpoints: clonedSet as any,
        });
    }

    private removeCheckpointItem = (checkpointName: string) => {
        const clonedSet = new Set(this.state.additionalCheckpoints);
        clonedSet.delete(checkpointName);
        return () => {
            this.setState({
                additionalCheckpoints: clonedSet as any,
            });
        }
    }

    private handleCheckpointModifierChange = (event: any): void => {
        this.setState({
            checkpointStatus: event.target.value,
        });

        if (event.target.value === 'AllCheckpoints') {
            const allCheckpoints = this.props.projectCreation.checkpoints.map((checkpoint) => {
                return checkpoint.name;
            });
            const allCheckpointsSet = new Set(allCheckpoints);
            this.setState({
                additionalCheckpoints: allCheckpointsSet,
            });
        } else {
            this.setState({
                additionalCheckpoints: new Set([]),
            })
        }
    }

    private getStepActiveContent(): any {
        const {
            stepperContent,
            projectNameContainer,
            projectName,
            usersContainer,
            paper,
            addedUserRow,
            dialogControl,
            dialogContent,
            dialogRow,
            dialogRowFirstItem,
            dialogRowSecondItem,
            selectControl,
            addedItemContainer,
            clearCheckpointIcon,
            checkpointContainer,
            projectUsersToolbarContainer,
        } = createProjectCreationClasses(this.props, this.state);

        if (this.state.activeStep === 0) {
            return (
                <div className={`${stepperContent} ${projectNameContainer}`}>
                    <Paper>
                        <TextField
                            className={projectName}
                            label="Project Name"
                            name="projectName"
                            value={this.props.projectCreation.projectName}
                            onChange={this.handleProjectNameChange}
                        />
                    </Paper>
                </div>
            )
        } else if (this.state.activeStep === 1) {
            return (
                <div className={`${stepperContent} ${checkpointContainer}`}>
                    <Checkpoints checkpoints={this.props.projectCreation.checkpoints} projectCreation={true}/>
                </div>
            )
        } else if (this.state.activeStep === 2) {
            const mappedUsers = this.props.projectCreation.projectUsers.map((user, index) => {
                    const numberOfUserCheckpoint = user.checkpoints.size;
                    const numberOfProjectCheckpoints = this.props.projectCreation.checkpoints.length;
                    const checkpointsText = numberOfUserCheckpoint === numberOfProjectCheckpoints ? 'All' : `${numberOfUserCheckpoint}/${numberOfProjectCheckpoints}`;
                    return (
                        <TableRow key={user.userId} className={addedUserRow} onClick={this.updateUserDialog(index)}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{checkpointsText}</TableCell>
                            <TableCell>{user.type}</TableCell>
                        </TableRow>
                    )
                }
            )

            const showOtherCheckpointField = this.state.checkpointStatus === 'AllCheckpointsExcept' || this.state.checkpointStatus === 'SomeCheckpoints';
            const checkpointItems = this.props.projectCreation.checkpoints.filter((checkpoint) => {
                return !this.state.additionalCheckpoints.has(checkpoint.name);
            }).map((checkpoint, index) => {
                return (
                    <MenuItem
                        value={checkpoint.name}
                        key={index}>
                        {checkpoint.name}
                    </MenuItem>

                )
            });
            const addedItems: any[] = [];
            this.state.additionalCheckpoints.forEach((checkpoint) => {
                addedItems.push(checkpoint);
            });
            const addedItemsWithElement = addedItems.map((addedItem, index) => {
                return (
                    <div className={addedItemContainer} key={index}>
                        <Typography>{addedItem}</Typography>
                        <ClearIcon onClick={this.removeCheckpointItem(addedItem)} className={clearCheckpointIcon}/>
                    </div>
                )
            });
            const otherCheckpointsField = showOtherCheckpointField ? (
                <div className={dialogRow}>
                    <div className={dialogRowFirstItem}>
                        <FormControl className={selectControl} disabled={checkpointItems.length <= 1}>
                            <InputLabel htmlFor="role">Select Checkpoints</InputLabel>
                            <Select
                                name=""
                                inputProps={{
                                    id: 'role',
                                }}
                                value={''}
                                onChange={this.handleAdditionalCheckpoint}
                            >
                                {checkpointItems}
                            </Select>
                        </FormControl>
                    </div>
                    <div className={dialogRowSecondItem}>
                        {addedItemsWithElement}
                    </div>
                </div>
            ) : undefined;

            return (
                <div className={`${stepperContent} ${usersContainer}`}>
                    <Paper className={paper}>
                        <Toolbar className={projectUsersToolbarContainer}>
                            <Typography variant="title">
                                Users
                            </Typography>
                            <Tooltip title="Add A User" placement="left">
                                <IconButton
                                    aria-label="Add A User"
                                    onClick={this.openUserDialog}
                                    color="secondary"
                                    type="button"
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Filter list">
                                <IconButton aria-label="Filter list">
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip> */}
                        </Toolbar>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Checkpoints</TableCell>
                                    <TableCell>Role</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mappedUsers}
                            </TableBody>
                        </Table>
                    </Paper>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                    >
                        <DialogTitle>{this.state.isUpdate ? 'Update User' : 'Add User To Project'}</DialogTitle>
                        <DialogContent className={dialogContent}>
                            <TextField
                                label="User"
                                name="user"
                                value={this.state.user}
                                className={dialogControl}
                                onChange={this.handleChange}
                            />
                            <FormControl>
                                <InputLabel htmlFor="role">Checkpoints</InputLabel>
                                <Select
                                    name="checkpointStatus"
                                    className={dialogControl}
                                    inputProps={{
                                        id: 'role',
                                    }}
                                    value={this.state.checkpointStatus}
                                    onChange={this.handleCheckpointModifierChange}
                                >
                                    <MenuItem value={'AllCheckpoints'}>Add User To All Checkpoints</MenuItem>
                                    <MenuItem value={'AllCheckpointsExcept'}>Add User To All Checkpoints Except For</MenuItem>
                                    <MenuItem value={'SomeCheckpoints'}>Add User To Some Checkpoints</MenuItem>
                                </Select>
                            </FormControl>
                            {otherCheckpointsField}
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={this.handleClose}>Cancel</Button>
                            <Button color="secondary" onClick={this.state.isUpdate ? this.updateProjectUser : this.addUserToProject}>{this.state.isUpdate ? 'Update User' : 'Add User' }</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        }
    }
}

const mapStateToProps = ({ projectCreation }: IAppState) => ({
    projectCreation,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateProjectName: (projectName: string) => {
        const projectNameUpdateAction = setProjectNameCreator(projectName);
        dispatch(projectNameUpdateAction);
    },
    getInitialProjectCreationCheckpoints: () => {
        dispatch(getInitialCheckpoints as any);
    },
    addProjectUser: (projectUser: IProjectCreationProjectUser) => {
        const projectUserAction = addProjectUserActionCreator(projectUser);
        dispatch(projectUserAction);
    },
    updateProjectUser: (projectUser: IProjectCreationProjectUser, index: number) => {
        const updateProjectUserAction = updateProjectUserActionCreator(projectUser, index);
        dispatch(updateProjectUserAction);
    }
})

export const connectedProjectCreation = connect(mapStateToProps, mapDispatchToProps)(ProjectCreationPresentation as any);
export const ProjectCreation = withTheme()(connectedProjectCreation as any);