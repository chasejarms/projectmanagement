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
import { IDoctorUser } from 'src/Models/doctorUser';
import { IUserCreateRequest } from 'src/Models/requests/userCreateRequest';
import { IStaffOrAdminUser } from 'src/Models/staffOrAdminUser';
import { IUnitedStatesAddress } from 'src/Models/unitedStatesAddress';
import { IUnitedStatesState } from 'src/Models/unitedStatesState';
import { UserType } from 'src/Models/userTypes';
import { emailValidator } from 'src/Validators/email.validator';
import Api from '../../Api/api';
import { FormControlState } from '../../Classes/formControlState';
import { AsyncButton } from '../../Components/AsyncButton/AsyncButton';
import { IUser } from '../../Models/user';
import { IAppState } from '../../Redux/Reducers/rootReducer';
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
        userRole: UserType.Staff,
        users: [],
        additionalCheckpoints: new Set([]),
        checkpoints: [],
        addingOrUpdatingUser: false,
        isUpdate: false,
        idOfUserBeingUpdated: '',
        uidOfUserBeingUpdated: '',
        deletingUser: false,
        street: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A street address is required'),
            ]
        }),
        state: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A state is required'),
            ]
        }),
        city: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A city is required'),
            ]
        }),
        zip: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A zip code is required'),
            ]
        }),
        telephone: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A telephone number is required'),
            ]
        }),
    };

    // tslint:disable-next-line:variable-name
    public _isMounted: boolean;

    public handleChange = (event: any) => {
        if (this._isMounted) {
            this.setState({
                [event.target.name]: event.target.value
            } as any);
        }
    }

    public async componentWillMount(): Promise<void> {
        this._isMounted = true;
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

        if (this._isMounted) {
            this.setState({
                users,
                checkpoints,
            })
        }
    }

    public componentWillUnmount(): void {
        this._isMounted = false;
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
            cityStateZipContainer,
            nameAndEmailContainer,
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
        const userRoleIsDoctor = this.state.userRole === UserType.Doctor;

        const {
            userFullName,
            userEmail,
            city,
            state,
            zip,
            street,
            telephone,
        } = this.state;

        const userFullNameError = userFullName.shouldShowError() ? userFullName.errors[0] : undefined;
        const userEmailError = userEmail.shouldShowError() ? userEmail.errors[0] : undefined;
        const cityError = city.shouldShowError() ? city.errors[0] : undefined;
        const stateError = state.shouldShowError() ? state.errors[0] : undefined;
        const zipError = zip.shouldShowError() ? zip.errors[0] : undefined;
        const streetError = street.shouldShowError() ? street.errors[0] : undefined;
        const telephoneError = telephone.shouldShowError() ? telephone.errors[0] : undefined;

        return (
            <div className={usersContainer}>
                <Paper className={usersPaper}>
                    <Toolbar className={usersToolbarContainer}>
                        <Typography variant="title">
                            Users
                        </Typography>
                        <Tooltip title="New User" placement="left" disableFocusListener={true}>
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
                    onExited={this.handleExited}
                >
                    <DialogTitle>{this.state.isUpdate ? 'Update User' : 'Create New User'}</DialogTitle>
                    <DialogContent className={dialogContent}>
                        <div className={nameAndEmailContainer}>
                            <FormControl required={true} error={userFullName.shouldShowError()}>
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
                            <FormControl required={true} error={userEmail.shouldShowError()}>
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
                        </div>
                        <FormControl required={true}>
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
                                <MenuItem value={UserType.Admin}>Admin</MenuItem>
                                <MenuItem value={UserType.Staff}>Staff</MenuItem>
                                <MenuItem value={UserType.Doctor}>Doctor</MenuItem>
                            </Select>
                        </FormControl>
                        {
                            userRoleIsDoctor ? undefined : (
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
                            )
                        }
                        {
                            userRoleIsDoctor ? (
                                <div>
                                    <FormControl required={true} className={dialogControl} error={this.state.street.shouldShowError()}>
                                        <InputLabel>Street</InputLabel>
                                        <Input
                                            name="street"
                                            value={this.state.street.value}
                                            onChange={this.handleStreetChange}
                                        />
                                        <FormHelperText>
                                            {streetError}
                                        </FormHelperText>
                                    </FormControl>
                                    <div className={cityStateZipContainer}>
                                        <FormControl required={true} error={this.state.city.shouldShowError()}>
                                            <InputLabel>City</InputLabel>
                                            <Input
                                                name="city"
                                                value={this.state.city.value}
                                                onChange={this.handleCityChange}
                                            />
                                            <FormHelperText>
                                                {cityError}
                                            </FormHelperText>
                                        </FormControl>
                                        <FormControl required={true} error={this.state.state.shouldShowError()}>
                                            <InputLabel htmlFor="state">State</InputLabel>
                                            <Select
                                                name="state"
                                                inputProps={{
                                                    id: 'state',
                                                }}
                                                value={this.state.state.value}
                                                onChange={this.handleStateChange}
                                            >
                                                {Object.keys(IUnitedStatesState).map((unitedStatesState, index) => {
                                                    return (
                                                        <MenuItem value={unitedStatesState} key={index}>
                                                            {unitedStatesState}
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>
                                            <FormHelperText>{stateError}</FormHelperText>
                                        </FormControl>
                                        <FormControl required={true} error={this.state.zip.shouldShowError()}>
                                            <InputLabel>Zip</InputLabel>
                                            <Input
                                                name="zip"
                                                value={this.state.zip.value}
                                                onChange={this.handleZipCodeChange}
                                            />
                                            <FormHelperText>
                                                {zipError}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                    <FormControl className={dialogControl} required={true} error={this.state.telephone.shouldShowError()}>
                                        <InputLabel>Telephone Number</InputLabel>
                                        <Input
                                            name="telephone"
                                            value={this.state.telephone.value}
                                            onChange={this.handleTelephoneChange}
                                        />
                                        <FormHelperText>
                                            {telephoneError}
                                        </FormHelperText>
                                    </FormControl>
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

    private handleExited = () => {
        if (this._isMounted) {
            this.setState({
                userFullName: this.state.userFullName
                    .setValue('')
                    .markAsBrandNew()
                    .markAsInvalid(),
                userEmail: this.state.userEmail
                    .setValue('')
                    .markAsBrandNew()
                    .markAsInvalid(),
                userRole: UserType.Staff,
                additionalCheckpoints: new Set([]),
                street: this.state.street.setValue('').markAsBrandNew().markAsInvalid(),
                state: this.state.state.setValue('').markAsBrandNew().markAsInvalid(),
                city: this.state.city.setValue('').markAsBrandNew().markAsInvalid(),
                zip: this.state.zip.setValue('').markAsBrandNew().markAsInvalid(),
                telephone: this.state.telephone.setValue('').markAsBrandNew().markAsInvalid(),
            });
        }
    }

    private controlsAreInvalid = () => {
        const {
            userEmail,
            userFullName,
            userRole,
            street,
            state,
            city,
            zip,
            telephone,
        } = this.state;

        const baseControlsAreInvalid = userEmail.invalid || userFullName.invalid;

        if (baseControlsAreInvalid) {
            return true;
        }

        if (userRole === UserType.Doctor) {
            return street.invalid || state.invalid || city.invalid || zip.invalid || telephone.invalid;
        }

        return false;
    }

    private handleUserFullNameChange = (event: any) => {
        const userFullName = event.target.value;
        const userFullNameControl = this.state.userFullName.setValue(userFullName);
        if (this._isMounted) {
            this.setState({
                userFullName: userFullNameControl,
            })
        }
    }

    private handleUserEmailChange = (event: any) => {
        const userEmail = event.target.value;
        const userEmailControl = this.state.userEmail.setValue(userEmail);
        if (this._isMounted) {
            this.setState({
                userEmail: userEmailControl,
            })
        }
    }

    private handleStateChange = (event: any) => {
        const state = event.target.value;
        const stateControl = this.state.state.setValue(state);
        if (this._isMounted) {
            this.setState({
                state: stateControl,
            })
        }
    }

    private handleCityChange = (event: any) => {
        const city = event.target.value;
        const cityControl = this.state.city.setValue(city);
        if (this._isMounted) {
            this.setState({
                city: cityControl,
            })
        }
    }

    private handleZipCodeChange = (event: any) => {
        const zip = event.target.value;
        const zipControl = this.state.zip.setValue(zip);
        if (this._isMounted) {
            this.setState({
                zip: zipControl,
            })
        }
    }

    private handleStreetChange = (event: any) => {
        const street = event.target.value;
        const streetControl = this.state.street.setValue(street);
        if (this._isMounted) {
            this.setState({
                street: streetControl,
            })
        }
    }

    private handleTelephoneChange = (event: any) => {
        const telephone = event.target.value;
        const telephoneControl = this.state.telephone.setValue(telephone);
        if (this._isMounted) {
            this.setState({
                telephone: telephoneControl,
            })
        }
    }

    private removeCheckpointItem = (workflowCheckpointId: string) => {
        const clonedSet = new Set(this.state.additionalCheckpoints);
        clonedSet.delete(workflowCheckpointId);
        return () => {
            if (this._isMounted) {
                this.setState({
                    additionalCheckpoints: clonedSet,
                });
            }
        }
    }

    private handleAdditionalCheckpoint = (event: any): any => {
        const clonedSet = new Set(this.state.additionalCheckpoints);
        clonedSet.add(event.target.value);
        if (this._isMounted) {
            this.setState({
                additionalCheckpoints: clonedSet,
            });
        }
    }

    private openNewUserDialog = () => {
        if (this._isMounted) {
            this.setState({
                open: true,
                isUpdate: false,
                idOfUserBeingUpdated: '',
                uidOfUserBeingUpdated: '',
            });
        }
    }

    private openExistingUserDialog = (user: IUser) => {
        const additionalCheckpoints = user.type === UserType.Doctor ? [] : (user as IStaffOrAdminUser).scanCheckpoints;
        const additionalCheckpointsSet = new Set(additionalCheckpoints);

        const streetValue = user.type === UserType.Doctor ? user.address.street : '';
        const cityValue = user.type === UserType.Doctor ? user.address.city : '';
        const stateValue = user.type === UserType.Doctor ? user.address.state : '';
        const zipValue = user.type === UserType.Doctor ? user.address.zip : '';
        const telephoneValue = user.type === UserType.Doctor ? user.telephone : '';

        return () => {
            if (this._isMounted) {
                this.setState({
                    open: true,
                    isUpdate: true,
                    additionalCheckpoints: additionalCheckpointsSet,
                    userFullName: this.state.userFullName.setValue(
                        user.fullName,
                    ).markAsBrandNew(),
                    userEmail: this.state.userEmail.setValue(
                        user.email,
                    ).markAsBrandNew(),
                    userRole: user.type,
                    idOfUserBeingUpdated: user.id,
                    uidOfUserBeingUpdated: user.uid,
                    street: this.state.street.setValue(
                        streetValue,
                    ).markAsBrandNew(),
                    city: this.state.city.setValue(
                        cityValue,
                    ).markAsBrandNew(),
                    state: this.state.state.setValue(
                        stateValue,
                    ).markAsBrandNew(),
                    zip: this.state.zip.setValue(
                        zipValue,
                    ).markAsBrandNew(),
                    telephone: this.state.telephone.setValue(
                        telephoneValue,
                    ).markAsBrandNew(),
                })
            }
        }
    }

    private handleClose = () => {
        if (this._isMounted) {
            this.setState({
                open: false,
            });
        }
    }

    private handleSave = async() => {
        const companyId = this.props.match.path.split('/')[2];
        const scanCheckpoints: string[] = [];
        this.state.additionalCheckpoints.forEach((checkpoint) => {
            scanCheckpoints.push(checkpoint);
        });

        if (this._isMounted) {
            this.setState({
                addingOrUpdatingUser: true,
            })
        }

        if (this.state.isUpdate) {
            const user = this.state.users.filter((compareUser) => {
                return compareUser.id === this.state.idOfUserBeingUpdated;
            })[0];

            let userUpdateRequest;

            if (this.state.userRole === UserType.Doctor) {
                userUpdateRequest = {
                    ...user,
                    fullName: this.state.userFullName.value,
                    email: this.state.userEmail.value,
                    type: this.state.userRole as any,
                    address: this.getAddressFromState(),
                    telephone: this.state.telephone.value,
                } as IDoctorUser;
            } else {
                userUpdateRequest = {
                    ...user,
                    fullName: this.state.userFullName.value,
                    email: this.state.userEmail.value,
                    type: this.state.userRole as any,
                    scanCheckpoints,
                } as IStaffOrAdminUser;
            }

            const userToUpdate = await Api.userApi.updateUser(userUpdateRequest);

            const users = this.state.users.map((compareUser) => {
                if (compareUser.id === userToUpdate.id) {
                    return userToUpdate;
                } else {
                    return compareUser;
                }
            })

            if (this._isMounted) {
                this.setState({
                    users,
                    addingOrUpdatingUser: false,
                    open: false,
                });
            }
        } else {
            const addUserRequest: IUserCreateRequest = {
                companyId,
                fullName: this.state.userFullName.value,
                email: this.state.userEmail.value,
                type: this.state.userRole as UserType,
            }

            if (this.state.userRole === UserType.Doctor) {
                addUserRequest.address = this.getAddressFromState();
                addUserRequest.telephone = this.state.telephone.value;
            } else {
                addUserRequest.scanCheckpoints = scanCheckpoints;
            }

            const addedUser = await Api.userApi.addUser(addUserRequest);

            if (this._isMounted) {
                this.setState({
                    addingOrUpdatingUser: false,
                    open: false,
                    users: this.state.users.concat([addedUser]),
                })
            }
        }
    }

    private getAddressFromState = (): IUnitedStatesAddress => {
        return {
            street: this.state.street.value,
            city: this.state.city.value,
            state: this.state.state.value as IUnitedStatesState,
            zip: this.state.zip.value,
        }
    }

    private handleDelete = async() => {
        const companyId = this.props.match.path.split('/')[2];
        if (this._isMounted) {
            this.setState({
                deletingUser: true,
            })
        }

        await Api.userApi.deleteUser({
            companyId,
            id: this.state.idOfUserBeingUpdated,
            uidOfUserToDelete: this.state.uidOfUserBeingUpdated,
        })

        const usersWithoutDeletedUser = this.state.users.filter((user) => {
            return user.id !== this.state.idOfUserBeingUpdated;
        });

        if (this._isMounted) {
            this.setState({
                deletingUser: false,
                open: false,
                users: usersWithoutDeletedUser,
            })
        }
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