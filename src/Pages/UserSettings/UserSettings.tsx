import * as React from 'react';
import {
    createUserSettingsClasses,
    IUserSettingsProps,
    IUserSettingsState,
} from './UserSettings.ias';

import {
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormControlState } from 'src/Classes/formControlState';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { UserType } from 'src/Models/userTypes';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import { passwordValidator } from 'src/Validators/password.validator';
import { requiredValidator } from 'src/Validators/required.validator';
import firebase from '../../firebase';

export class UserSettingsPresentation extends React.Component<
    IUserSettingsProps,
    IUserSettingsState
> {
    public state: IUserSettingsState = {
        firstPassword: new FormControlState({
            value: '',
            validators: [
                requiredValidator(''),
                passwordValidator,
            ],
        }).markAsInvalid(),
        secondPassword: new FormControlState({
            value: '',
            validators: [
                requiredValidator(''),
                passwordValidator,
            ],
        }).markAsInvalid(),
        updatingUserPassword: false,
        snackbarIsOpen: false,
        updatingUserPasswordIsSuccess: false,
    }

    // tslint:disable-next-line:variable-name
    private _isMounted: boolean;

    public componentWillMount(): void {
        this._isMounted = true;
    }

    public componentWillUnmount(): void {
        this._isMounted = false;
    }

    public componentDidMount(): void {
        const secondPassword = this.state.secondPassword.setValue(this.state.secondPassword.value);
        secondPassword.validators.push(this.samePasswordForConfirmDialog)
        secondPassword.markAsInvalid()
            .markAsUntouched()
            .markAsPristine();
        
        if (this._isMounted) {
            this.setState({
                secondPassword,
            })
        }
    }

    public render() {
        const {
            userSettingsContainer,
            userSettingsPaper,
            accountSettingsTitle,
            userInformationContainer,
            resetPasswordContainer,
            resetPasswordNotTitleContainer,
            resetPasswordTitle,
            resetPasswordButtonContainer,
            asyncButton,
        } = createUserSettingsClasses(this.props, this.state);

        const companyId = this.props.location.pathname.split('/')[2];
        const user = this.props.userState[companyId];

        return (
            <div className={userSettingsContainer}>
                <Paper className={userSettingsPaper}>
                    <Typography variant="title" className={accountSettingsTitle}>Account Settings</Typography>
                    <div className={userInformationContainer}>
                        <TextField
                            disabled={true}
                            label="Name"
                            name="name"
                            value={user.name}
                        />
                        <TextField
                            disabled={true}
                            label="Email"
                            name="email"
                            value={user.email}
                        />
                        <FormControl>
                            <InputLabel>Role</InputLabel>
                            <Select
                                disabled={true}
                                name="userType"
                                inputProps={{
                                    id: 'role',
                                }}
                                value={user.type}
                            >
                                <MenuItem value={UserType.Admin}>Admin</MenuItem>
                                <MenuItem value={UserType.Staff}>Staff</MenuItem>
                                <MenuItem value={UserType.Doctor}>Doctor</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={resetPasswordContainer}>
                        <Typography variant="title" className={resetPasswordTitle}>Password Reset</Typography>
                        <div className={resetPasswordNotTitleContainer}>
                            <FormControl
                                disabled={this.state.updatingUserPassword}
                                required={true}
                                error={this.state.firstPassword.shouldShowError()}
                            >
                                <InputLabel>New Password</InputLabel>
                                <Input
                                    type="password"
                                    value={this.state.firstPassword.value}
                                    onChange={this.handleNewPasswordChange}
                                />
                                <FormHelperText>{this.state.firstPassword.errors[0]}</FormHelperText>
                            </FormControl>
                            <FormControl
                                disabled={this.state.updatingUserPassword}
                                required={true}
                                error={this.state.secondPassword.shouldShowError()}
                            >
                                <InputLabel>Confirm Password</InputLabel>
                                <Input
                                    type="password"
                                    value={this.state.secondPassword.value}
                                    onChange={this.handleSecondPasswordChange}
                                />
                                <FormHelperText>{this.state.secondPassword.errors[0]}</FormHelperText>
                            </FormControl>
                            <div className={resetPasswordButtonContainer}>
                                <AsyncButton
                                    className={asyncButton}
                                    asyncActionInProgress={this.state.updatingUserPassword}
                                    disabled={this.state.updatingUserPassword || this.someControlsAreInvalid()}
                                    color="secondary"
                                    variant="contained"
                                    onClick={this.resetUserPassword}
                                >
                                    Reset Password
                                </AsyncButton>
                            </div>
                            <Snackbar
                                open={this.state.snackbarIsOpen}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                autoHideDuration={5000}
                                message={
                                    (
                                        <span>
                                            {this.state.updatingUserPasswordIsSuccess ? (
                                                'Success! Your password has been reset.'
                                            ): (
                                                'Oops! It looks like there was an error.'
                                            )}
                                        </span>
                                    )
                                }
                                onClose={this.handleSnackbarClose}
                            />
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }

    private handleSnackbarClose = (): void => {
        if (this._isMounted) {
            this.setState({
                snackbarIsOpen: false,
            })
        }
    }

    private resetUserPassword = async(): Promise<void> => {
        const user = firebase.auth().currentUser!;
        try {
            if (this._isMounted) {
                this.setState({
                    updatingUserPassword: true,
                })
            }
            await user.updatePassword(this.state.firstPassword.value)
        } catch {
            if (this._isMounted) {
                this.setState({
                    updatingUserPassword: false,
                    updatingUserPasswordIsSuccess: false,
                    snackbarIsOpen: true,
                })   
            }
            this.resetResetPasswordControls();
            return;
        }

        if (this._isMounted) {
            this.setState({
                updatingUserPassword: false,
                snackbarIsOpen: true,
                updatingUserPasswordIsSuccess: true,
            })
        }
        this.resetResetPasswordControls();
    }

    private handleNewPasswordChange = (event: any): void => {
        const value = event.target.value;
        const firstPasswordFormControlState = this.state.firstPassword.setValue(value);
        const secondPassword = this.state.secondPassword.setValue(this.state.secondPassword.value);
        if (this._isMounted) {
            this.setState({
                firstPassword: firstPasswordFormControlState,
                secondPassword,
            })
        }
    }

    private handleSecondPasswordChange = (event: any): void => {
        const value = event.target.value;
        const firstPassword = this.state.firstPassword.setValue(this.state.firstPassword.value);
        const secondPasswordFormControlState = this.state.secondPassword.setValue(value);
        if (this._isMounted) {
            this.setState({
                firstPassword,
                secondPassword: secondPasswordFormControlState,
            })
        }
    }

    private someControlsAreInvalid = (): boolean => {
        return this.state.firstPassword.invalid || this.state.secondPassword.invalid;
    }

    private resetResetPasswordControls = (): void => {
        const firstPassword = this.state.firstPassword.setValue('')
            .markAsInvalid()
            .markAsTouched()
            .markAsPristine();

        const secondPassword = this.state.secondPassword.setValue('')
            .markAsInvalid()
            .markAsTouched()
            .markAsPristine();

        if (this._isMounted) {
            this.setState({
                firstPassword,
                secondPassword,
            })
        }
    }

    private samePasswordForConfirmDialog = (value: any): string | null => {
        if (this.state.firstPassword.value !== this.state.secondPassword.value) {
            // tslint:disable-next-line:no-console
            console.log('the passwords do not match');
            return 'The passwords must match';
        } else {
            return null;
        }
    }
}

const mapStateToProps = ({ userState }: IAppState) => ({
    userState
});

const connectedComponent = connect(mapStateToProps, undefined)(UserSettingsPresentation as any);
export const UserSettings = withRouter(connectedComponent as any);
