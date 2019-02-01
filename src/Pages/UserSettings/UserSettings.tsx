import * as React from 'react';
import {
    createUserSettingsClasses,
    IUserSettingsProps,
    IUserSettingsState,
} from './UserSettings.ias';

import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
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
    }

    public componentDidMount(): void {
        const secondPassword = this.state.secondPassword.setValue(this.state.secondPassword.value);
        secondPassword.validators.push(this.samePasswordForConfirmDialog);
        this.setState({
            secondPassword,
        })
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
                            label="Full Name"
                            name="fullName"
                            value={user.fullName}
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
                            <TextField
                                label="New Password"
                                value={this.state.firstPassword.value}
                                onChange={this.handleNewPasswordChange}
                                type="password"
                                disabled={this.state.updatingUserPassword}
                            />
                            <TextField
                                label="Confirm Password"
                                value={this.state.secondPassword.value}
                                onChange={this.handleSecondPasswordChange}
                                type="password"
                                disabled={this.state.updatingUserPassword}
                            />
                            <div className={resetPasswordButtonContainer}>
                                <AsyncButton
                                    asyncActionInProgress={this.state.updatingUserPassword}
                                    disabled={this.state.updatingUserPassword || this.someControlsAreInvalid()}
                                    color="secondary"
                                    variant="contained"
                                    onClick={this.resetUserPassword}
                                >
                                    Reset Password
                                </AsyncButton>
                            </div>
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }

    private resetUserPassword = async(): Promise<void> => {
        const user = firebase.auth().currentUser!;
        try {
            this.setState({
                updatingUserPassword: true,
            })
            await user.updatePassword(this.state.firstPassword.value)
        } catch {
            this.setState({
                updatingUserPassword: false,
            })
            this.resetResetPasswordControls();
            // tslint:disable-next-line:no-console
            console.log('updating the password failed');
        }

        this.setState({
            updatingUserPassword: false,
        })
        this.resetResetPasswordControls();
    }

    private handleNewPasswordChange = (event: any): void => {
        const value = event.target.value;
        const firstPasswordFormControlState = this.state.firstPassword.setValue(value);
        const secondPassword = this.state.secondPassword.setValue(this.state.secondPassword.value);
        this.setState({
            firstPassword: firstPasswordFormControlState,
            secondPassword,
        })
    }

    private handleSecondPasswordChange = (event: any): void => {
        const value = event.target.value;
        const firstPassword = this.state.firstPassword.setValue(this.state.firstPassword.value);
        const secondPasswordFormControlState = this.state.secondPassword.setValue(value);
        this.setState({
            firstPassword,
            secondPassword: secondPasswordFormControlState,
        })
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

        this.setState({
            firstPassword,
            secondPassword,
        })
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
