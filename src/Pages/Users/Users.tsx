import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    IconButton,
    Input,
    InputLabel,
    MenuItem,
    Select,
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
import { emailValidator } from 'src/Validators/email.validator';
import Api from '../../Api/api';
import { FormControlState } from '../../Classes/formControlState';
import { AsyncButton } from '../../Components/AsyncButton/AsyncButton';
import { IUser } from '../../Models/user';
import { handleChange } from '../../Utils/handleChange';
import { requiredValidator } from '../../Validators/required.validator';
import { createUsersPresentationClasses, IUsersPresentationProps, IUsersPresentationState } from './Users.ias';

export class UsersPresentation extends React.Component<IUsersPresentationProps, IUsersPresentationState> {
    public state: IUsersPresentationState = {
        open: false,
        userFullName: new FormControlState({
            value: '',
            validators: [
                requiredValidator('The user\'s full name is required'),
            ]
        }).markAsInvalid(),
        userEmail: new FormControlState({
            value: '',
            validators: [
                requiredValidator('An email is required'),
                emailValidator,
            ]
        }).markAsInvalid(),
        userRole: 'Staff',
        users: [],
        additionalCheckpoints: new Set([]),
        checkpoints: [],
        addingUser: false,
    };

    public handleChange = handleChange(this);

    public async componentWillMount(): Promise<void> {
        const companyId = this.props.match.path.split('/')[2];
        const users = await Api.userApi.getUsers(companyId);
        this.setState({
            users,
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
                <TableRow key={user.uid} className={userRow}>
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
        const showAdditionalCheckpoints = this.state.userRole === "Staff" || this.state.userRole === "Admin";

        const {
            userFullName,
            userEmail,
        } = this.state;

        const userFullNameError = userFullName.shouldShowError() ? userFullName.errors[0] : undefined;
        const userEmailError = userEmail.shouldShowError() ? userEmail.errors[0] : undefined;

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
                        <FormControl required={true} className={dialogControl} error={userFullName.shouldShowError()}>
                            <InputLabel>Full Name</InputLabel>
                            <Input
                                name="userFullName"
                                value={userFullName.value}
                                onChange={this.handleUserFullNameChange}
                            />
                            <FormHelperText>
                                {userFullNameError}
                            </FormHelperText>
                        </FormControl>
                        <FormControl required={true} className={dialogControl} error={userEmail.shouldShowError()}>
                            <InputLabel>Email</InputLabel>
                            <Input
                                name="newUserEmail"
                                value={userEmail.value}
                                onChange={this.handleUserEmailChange}
                            />
                            <FormHelperText>
                                {userEmailError}
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="role">Role</InputLabel>
                            <Select
                                name="userRole"
                                className={dialogControl}
                                inputProps={{
                                    id: 'role',
                                }}
                                value={this.state.userRole}
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
                        <Button
                            color="primary"
                            onClick={this.handleClose}
                            disabled={this.state.addingUser}
                        >
                            Cancel
                        </Button>
                        <AsyncButton
                            color="secondary"
                            onClick={this.handleSave}
                            disabled={this.controlsAreInvalid() || this.state.addingUser}
                            asyncActionInProgress={this.state.addingUser}
                        >
                            Add User
                        </AsyncButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    private controlsAreInvalid = () => {
        const {
            userEmail,
            userFullName,
        } = this.state;

        return userEmail.invalid || userFullName.invalid;
    }

    private handleUserFullNameChange = (event: any) => {
        const userFullName = event.target.value;
        const userFullNameControl = this.state.userFullName.setValue(userFullName);
        this.setState({
            userFullName: userFullNameControl,
        })
    }

    private handleUserEmailChange = (event: any) => {
        const userEmail = event.target.value;
        const userEmailControl = this.state.userEmail.setValue(userEmail);
        this.setState({
            userEmail: userEmailControl,
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
            userFullName: this.state.userFullName
                .setValue('')
                .markAsUntouched()
                .markAsPristine()
                .markAsInvalid(),
            userEmail: this.state.userEmail
                .setValue('')
                .markAsUntouched()
                .markAsPristine()
                .markAsInvalid(),
            userRole: 'Staff',
        });
    }

    private handleSave = async() => {
        const companyId = this.props.match.path.split('/')[2];
        const scanCheckpoints: string[] = [];
        this.state.additionalCheckpoints.forEach((checkpoint) => {
            scanCheckpoints.push(checkpoint);
        });

        this.setState({
            addingUser: true,
        })

        const addedUser = await Api.userApi.addUser({
            companyId,
            fullName: this.state.userFullName.value,
            email: this.state.userEmail.value,
            type: this.state.userRole as any,
            scanCheckpoints,
            mustResetPassword: true,
        })

        // tslint:disable-next-line:no-console
        console.log(addedUser);

        this.setState({
            addingUser: false,
            open: false,
            users: this.state.users.concat([addedUser]),
        })
    }
}

export const Users = withRouter(UsersPresentation);