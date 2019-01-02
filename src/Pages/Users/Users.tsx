import {
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
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { emailValidator } from 'src/Validators/email.validator';
import Api from '../../Api/api';
import { FormControlState } from '../../Classes/formControlState';
import { AsyncButton } from '../../Components/AsyncButton/AsyncButton';
import { IUser } from '../../Models/user';
import { IAppState } from '../../Redux/Reducers/rootReducer';
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
        addingOrUpdatingUser: false,
        isUpdate: false,
        idOfUserBeingUpdated: '',
        deletingUser: false,
    };

    public handleChange = handleChange(this);

    public async componentWillMount(): Promise<void> {
        const companyId = this.props.match.path.split('/')[2];

        const getUsersPromise = Api.userApi.getUsers(companyId);
        const getWorkflowCheckpointsPromise = Api.workflowApi.getWorkflow(companyId);

        const [
            users,
            checkpoints,
        ] = await Promise.all([
            getUsersPromise,
            getWorkflowCheckpointsPromise,
        ]);

        this.setState({
            users,
            checkpoints,
        })
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
            dialogActionButtons,
        } = createUsersPresentationClasses(this.props, this.state);

        const mappedUsers = this.state.users.map((user: IUser) => (
                <TableRow key={user.uid} className={userRow} onClick={this.openExistingUserDialog(user)}>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.type}</TableCell>
                </TableRow>
            )
        )

        const checkpointItems = this.state.checkpoints.filter((workflowCheckpoint) => {
            return !this.state.additionalCheckpoints.has(workflowCheckpoint.id);
        }).map((workflowCheckpoint, index) => {
            return (
                <MenuItem
                    value={workflowCheckpoint.id}
                    key={index}>
                    {workflowCheckpoint.name}
                </MenuItem>
            )
        });

        const addedItems: any[] = [];
        this.state.additionalCheckpoints.forEach((checkpoint) => {
            addedItems.push(checkpoint);
        });

        const workflowIdToNameDictionary = this.state.checkpoints.reduce((acc, workflowCheckpoint) => {
            acc[workflowCheckpoint.id] = workflowCheckpoint.name;
            return acc;
        }, {});

        const addedItemsWithElement = addedItems.map((addedItem, index) => {
            return (
                <div key={index} className={addedItemContainer}>
                    <Typography>{workflowIdToNameDictionary[addedItem]}</Typography>
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
                    <DialogActions className={dialogActionButtons}>
                        <div>
                            {this.state.isUpdate ? (
                                <AsyncButton
                                    color="secondary"
                                    onClick={this.handleDelete}
                                    disabled={this.state.addingOrUpdatingUser || this.state.deletingUser || this.isSameUser()}
                                    asyncActionInProgress={this.state.deletingUser}
                                >
                                    Delete
                                </AsyncButton>
                            ) : undefined}
                        </div>
                        <AsyncButton
                            color="secondary"
                            onClick={this.handleSave}
                            disabled={this.controlsAreInvalid() || this.state.addingOrUpdatingUser || this.state.deletingUser}
                            asyncActionInProgress={this.state.addingOrUpdatingUser}
                        >
                            {this.state.isUpdate ? 'Update User' : 'Add User'}
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

    private removeCheckpointItem = (workflowCheckpointId: string) => {
        const clonedSet = new Set(this.state.additionalCheckpoints);
        clonedSet.delete(workflowCheckpointId);
        return () => {
            this.setState({
                additionalCheckpoints: clonedSet,
            });
        }
    }

    private handleAdditionalCheckpoint = (event: any): any => {
        const clonedSet = new Set(this.state.additionalCheckpoints);
        clonedSet.add(event.target.value);
        this.setState({
            additionalCheckpoints: clonedSet,
        });
    }

    private openNewUserDialog = () => {
        this.setState({
            open: true,
            isUpdate: false,
            idOfUserBeingUpdated: '',
        });
    }

    private openExistingUserDialog = (user: IUser) => {
        return () => {
            this.setState({
                open: true,
                isUpdate: true,
                additionalCheckpoints: new Set(user.scanCheckpoints!),
                userFullName: this.state.userFullName.setValue(
                    user.fullName,
                )
                .markAsUntouched()
                .markAsValid()
                .markAsPristine(),
                userEmail: this.state.userEmail.setValue(
                    user.email,
                )
                .markAsUntouched()
                .markAsValid()
                .markAsPristine(),
                userRole: user.type,
                idOfUserBeingUpdated: user.id,
            })
        }
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
            addingOrUpdatingUser: true,
        })

        if (this.state.isUpdate) {
            const user = this.state.users.filter((compareUser) => {
                return compareUser.id === this.state.idOfUserBeingUpdated;
            })[0];

            const userToUpdate = await Api.userApi.updateUser({
                ...user,
                fullName: this.state.userFullName.value,
                email: this.state.userEmail.value,
                type: this.state.userRole as any,
                scanCheckpoints,
            })

            const users = this.state.users.map((compareUser) => {
                if (compareUser.id === userToUpdate.id) {
                    return userToUpdate;
                } else {
                    return compareUser;
                }
            })

            this.setState({
                users,
                addingOrUpdatingUser: false,
                open: false,
            });
        } else {
            const addedUser = await Api.userApi.addUser({
                companyId,
                fullName: this.state.userFullName.value,
                email: this.state.userEmail.value,
                type: this.state.userRole as any,
                scanCheckpoints,
                mustResetPassword: true,
            })

            this.setState({
                addingOrUpdatingUser: false,
                open: false,
                users: this.state.users.concat([addedUser]),
            })
        }
    }

    private handleDelete = async() => {
        const companyId = this.props.match.path.split('/')[2];
        this.setState({
            deletingUser: true,
        })

        await Api.userApi.deleteUser({
            companyId,
            id: this.state.idOfUserBeingUpdated,
        })

        const usersWithoutDeletedUser = this.state.users.filter((user) => {
            return user.id !== this.state.idOfUserBeingUpdated;
        });

        this.setState({
            deletingUser: false,
            open: false,
            users: usersWithoutDeletedUser,
        })


    }

    private isSameUser = (): boolean => {
        const companyId = this.props.match.path.split('/')[2];
        return this.props.userState[companyId].id === this.state.idOfUserBeingUpdated;
    }
}

const mapStateToProps = ({ userState }: IAppState) => ({
    userState
});

const connectedComponent = connect(mapStateToProps)(UsersPresentation);
export const Users = withRouter(connectedComponent);