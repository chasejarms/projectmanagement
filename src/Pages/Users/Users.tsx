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
    Select,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import * as React from 'react';
import { withRouter } from 'react-router';
import Api from '../../Api/api';
import { IUser } from '../../Models/user';
import { handleChange } from '../../Utils/handleChange';
import { createUsersPresentationClasses, IUsersPresentationProps, IUsersPresentationState } from './Users.ias';

export class UsersPresentation extends React.Component<IUsersPresentationProps, IUsersPresentationState> {
    public state: IUsersPresentationState = {
        open: false,
        newUserFullName: '',
        newUserEmail: '',
        newUserRole: 'Staff',
        users: [],
        additionalCheckpoints: new Set([]),
        checkpoints: [],
    };

    public handleChange = handleChange(this);

    public async componentWillMount(): Promise<void> {
        const companyName = this.props.match.path.split('/')[2];
        // tslint:disable-next-line:no-console
        console.log(companyName);
        const users = await Api.userApi.getUsers(companyName);
        // const workflow = Api.workflowApi.getWorkflow(companyName);
        this.setState({
            users,
            // checkpoints: workflow.checkpoints,
        });
    }

    public render() {
        const {
            dialogContent,
            dialogControl,
            usersContainer,
            usersToolbarContainer,
            userRow,
            usersPaper,
            clearCheckpointIcon,
            addedItemContainer,
            automaticScanCheckpointsContainer,
            potentialCheckpointsContainer,
            potentialCheckpointsSelect,
            automaticScanCheckpoints,
        } = createUsersPresentationClasses(this.props, this.state);

        const mappedUsers = this.state.users.map((user: IUser) => (
                <TableRow key={user.id} className={userRow}>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.type}</TableCell>
                </TableRow>
            )
        )

        const checkpointItems = this.state.checkpoints.filter((checkpoint) => {
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
                <div key={index} className={addedItemContainer}>
                    <Typography>{addedItem}</Typography>
                    <ClearIcon onClick={this.removeCheckpointItem(addedItem)} className={clearCheckpointIcon}/>
                </div>
            )
        });
        const showAdditionalCheckpoints = this.state.newUserRole === "Staff" || this.state.newUserRole === "Admin";

        return (
            <div className={usersContainer}>
                <Paper className={usersPaper}>
                    <Toolbar className={usersToolbarContainer}>
                        <Typography variant="title">
                            Users
                        </Typography>
                        <Tooltip title="New User" placement="left">
                            <IconButton
                                aria-label="New User"
                                onClick={this.openNewUserDialog}
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
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
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
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogContent className={dialogContent}>
                        <TextField
                            label="Full Name"
                            name="newUserFullName"
                            value={this.state.newUserFullName}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                        <TextField
                            label="Email"
                            name="newUserEmail"
                            value={this.state.newUserEmail}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                        <FormControl>
                            <InputLabel htmlFor="role">Role</InputLabel>
                            <Select
                                name="newUserRole"
                                className={dialogControl}
                                inputProps={{
                                    id: 'role',
                                }}
                                value={this.state.newUserRole}
                                onChange={this.handleChange}
                            >
                                <MenuItem value={'Admin'}>Admin</MenuItem>
                                <MenuItem value={'Staff'}>Staff</MenuItem>
                                <MenuItem value={'Customer'}>Customer</MenuItem>
                            </Select>
                        </FormControl>
                        {
                            showAdditionalCheckpoints ? (
                                <div className={automaticScanCheckpointsContainer}>
                                    <div className={potentialCheckpointsContainer}>
                                        <FormControl disabled={checkpointItems.length === 0} className={potentialCheckpointsSelect}>
                                            <InputLabel htmlFor="role">Automatic Checkpoint Completion</InputLabel>
                                            <Select
                                                name=""
                                                inputProps={{
                                                    id: "role",
                                                }}
                                                value={""}
                                                onChange={this.handleAdditionalCheckpoint}
                                            >
                                                {checkpointItems}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className={automaticScanCheckpoints}>
                                        {addedItemsWithElement}
                                    </div>
                                </div>
                            ) : undefined
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={this.handleSave}>Add User</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
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

    private handleAdditionalCheckpoint = (event: any): any => {
        const clonedSet = new Set(this.state.additionalCheckpoints);
        clonedSet.add(event.target.value);
        this.setState({
            additionalCheckpoints: clonedSet as any,
        });
    }

    private openNewUserDialog = () => {
        this.setState({ open: true });
    }

    private handleClose = () => {
        this.setState({
            open: false,
            newUserFullName: '',
            newUserEmail: '',
            newUserRole: 'Staff',
        });
    }

    private handleSave = () => {
        const companyName = this.props.match.path.split('/')[2];
        const scanCheckpoints: string[] = [];
        this.state.additionalCheckpoints.forEach((checkpoint) => {
            scanCheckpoints.push(checkpoint);
        });

        Api.userApi.addUser(companyName, {
            fullName: this.state.newUserFullName,
            email: this.state.newUserEmail,
            type: this.state.newUserRole as any,
            id: '1',
            scanCheckpoints,
            mustResetPassword: false,
            uid: '5',
        })

        Api.userApi.getUsers(companyName).then((users) => {
            this.setState({
                open: false,
                newUserFullName: '',
                newUserEmail: '',
                newUserRole: 'Staff',
                users,
            });
        });
    }
}

export const Users = withRouter(UsersPresentation);