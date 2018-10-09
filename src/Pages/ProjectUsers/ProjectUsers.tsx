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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import * as React from 'react';
import { withRouter } from 'react-router';
import Api from '../../Api/api';
import { ICheckpoint } from '../../Models/checkpoint';
import { IProjectCreationProjectUser } from '../../Models/projectUser';
import { handleChange } from '../../Utils/handleChange';
import {
    createProjectUsersClasses,
    IProjectUsersProps,
    IProjectUsersState
} from './ProjectsUsers.ias';

export class ProjectUsersPresentation extends React.Component<IProjectUsersProps, IProjectUsersState> {
    public state = {
        open: false,
        checkpoints: [],
        user: '',
        checkpointStatus: '',
        additionalCheckpoints: new Set<string>([]),
        users: [],
    }

    public handleChange = handleChange(this);

    public componentWillMount(): void {
        const projectId = this.props.match.params['projectId'];
        const users = Api.projectsApi.getProjectUsers('does not matter', projectId);
        const checkpoints = Api.projectsApi.getProjectCheckpoints('does not matter', projectId);

        this.setState({
            users,
            checkpoints,
        })
    }
    
    public render() {
        const {
            usersContainer,
            paper,
            dialogControl,
            projectUsersToolbarContainer,
            dialogContent,
            addedUserRow,
            dialogRow,
            dialogRowFirstItem,
            dialogRowSecondItem,
            selectControl,
            addedItemContainer,
            clearCheckpointIcon,
        } = createProjectUsersClasses(this.props, this.state);

        const mappedUsers = this.state.users.map((user: IProjectCreationProjectUser) => (
                <TableRow key={user.userId} className={addedUserRow} onClick={this.openUserDialog}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>All</TableCell>
                    <TableCell>{user.type}</TableCell>
                </TableRow>
            )
        )

        const showOtherCheckpointField = this.state.checkpointStatus === 'AllCheckpointsExcept' || this.state.checkpointStatus === 'SomeCheckpoints';
        const checkpointItems = this.state.checkpoints.filter((checkpoint: ICheckpoint) => {
            return !this.state.additionalCheckpoints.has(checkpoint.name);
        }).map((checkpoint: ICheckpoint, index) => {
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
            <div className={`${usersContainer}`}>
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
                        <Button color="primary" onClick={this.handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={this.addUserToProject}>Add User</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    private openUserDialog = () => {
        this.setState({
            open: true,
        });
    }

    private handleClose = () => {
        this.setState({
            open: false,
        });

        setTimeout(() => {
            this.setState({
                user: '',
                checkpointStatus: '',
            });
        });
    }

    private handleAdditionalCheckpoint = (event: any) => {
        const clonedSet = new Set(this.state.additionalCheckpoints);
        clonedSet.add(event.target.value);
        // tslint:disable-next-line:no-console
        console.log(event.target.value);
        this.setState({
            additionalCheckpoints: clonedSet as any,
        });
    }

    private addUserToProject = () => {
        // add user to project
        this.setState({
            open: false,
        })
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
}

export const ProjectUsers = withRouter(ProjectUsersPresentation);