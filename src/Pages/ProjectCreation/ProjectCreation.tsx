import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
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
    Typography,
    withTheme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import * as React from 'react';
import { WorkflowCheckpoint } from '../../Components/WorkflowCheckpoint/WorkflowCheckpoint';
import { users } from '../../MockData/users';
import { workflow } from '../../MockData/workflow';
import { handleChange } from '../../Utils/handleChange';
import {
    createProjectCreationClasses,
    IProjectCreationProps,
    IProjectCreationState,
} from './ProjectCreation.ias';

export class ProjectCreationPresentation extends React.Component<IProjectCreationProps, IProjectCreationState> {
    public state = {
        open: false,
        activeStep: 2,
        projectName: '',
        checkpoints: [],
        user: '',
        checkpointStatus: '',
        role: '',
        additionalCheckpoints: new Set<string>([]),
    }

    public handleChange = handleChange(this);

    public render() {
        const {
            projectCreationContainer,
            stepperContainer,
            topBar,
        } = createProjectCreationClasses(this.props, this.state);

        return (
            <div className={projectCreationContainer}>
                <div className={topBar}>
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
                    {this.createActionButtons()}
                </div>
                <Divider/>
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

    private onSaveClick = () => {
        // tslint:disable-next-line:no-console
        console.log('saving');
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
                onClick={this.onSaveClick}
                color="primary">
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
        });
    }

    private addUserToProject = (): void => {
        // add user to project
        this.setState({
            open: false,
        })
    }

    private handleAdditionalCheckpoint = (event: any): any => {
        const clonedSet = new Set(this.state.additionalCheckpoints);
        clonedSet.add(event.target.value);
        // tslint:disable-next-line:no-console
        console.log(event.target.value);
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

    private getStepActiveContent(): any {
        const {
            stepperContent,
            projectNameContainer,
            projectName,
            multipleCheckpointsContainer,
            singleCheckpointContainer,
            usersContainer,
            paper,
            addedUserRow,
            fabButton,
            dialogControl,
            dialogContent,
            dialogRow,
            dialogRowFirstItem,
            dialogRowSecondItem,
            selectControl,
            addedItemContainer,
            clearCheckpointIcon,
        } = createProjectCreationClasses(this.props, this.state);

        if (this.state.activeStep === 0) {
            return (
                <div className={`${stepperContent} ${projectNameContainer}`}>
                    <TextField
                        className={projectName}
                        label="Project Name"
                        name="projectName"
                        value={this.state.projectName}
                        onChange={this.handleChange}
                    />
                </div>
            )
        } else if (this.state.activeStep === 1) {
            const workflowCheckpoints = workflow.checkpoints.map((workflowCheckpoint, index) => {
                const isOddCheckpoint = index % 2 === 0;
    
                return (
                    <div key={index} className={singleCheckpointContainer}>
                        <WorkflowCheckpoint
                            theme={this.props.theme}
                            workflowCheckpoint={workflowCheckpoint}
                            greyBackground={isOddCheckpoint}
                            isFirstCheckpoint={index === 0}
                            />
                    </div>
                )
            });

            return (
                <div className={`${stepperContent} ${multipleCheckpointsContainer}`}>
                    {workflowCheckpoints}
                </div>
            )
        } else if (this.state.activeStep === 2) {
            const mappedUsers = users.map(user => (
                    <TableRow key={user.id} className={addedUserRow} onClick={this.openUserDialog}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>All</TableCell>
                        <TableCell>{user.type}</TableCell>
                    </TableRow>
                )
            )

            const showOtherCheckpointField = this.state.checkpointStatus === 'AllCheckpointsExcept' || this.state.checkpointStatus === 'SomeCheckpoints';
            const checkpointItems = workflow.checkpoints.filter((checkpoint) => {
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
                    <Button
                        type="button"
                        variant="fab"
                        color="primary"
                        className={fabButton}
                        onClick={this.openUserDialog}>
                        <AddIcon/>
                    </Button>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                    >
                        <DialogTitle>Add User To Project</DialogTitle>
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
                                    onChange={this.handleChange}
                                >
                                    <MenuItem value={'AllCheckpoints'}>Add User To All Checkpoints</MenuItem>
                                    <MenuItem value={'AllCheckpointsExcept'}>Add User To All Checkpoints Except For</MenuItem>
                                    <MenuItem value={'SomeCheckpoints'}>Add User To Some Checkpoints</MenuItem>
                                </Select>
                            </FormControl>
                            {otherCheckpointsField}
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
                            <Button color="primary" onClick={this.addUserToProject}>Add User</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        }
    }
}

export const ProjectCreation = withTheme()(ProjectCreationPresentation);