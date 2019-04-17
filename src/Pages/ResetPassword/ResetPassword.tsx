import { FormControl, FormHelperText, Input, InputLabel, Snackbar, Typography, withTheme } from '@material-ui/core';
import * as React from 'react';
import { FormControlState } from 'src/Classes/formControlState';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { emailValidator } from 'src/Validators/email.validator';
import { requiredValidator } from 'src/Validators/required.validator';
import firebase from '../../firebase';
import { createResetPasswordClasses, IResetPasswordProps, IResetPasswordState } from './ResetPassword.ias';

export class ResetPasswordPresentation extends React.Component<IResetPasswordProps, IResetPasswordState> {
    // tslint:disable-next-line:variable-name
    public _isMounted: boolean;
    public state: IResetPasswordState = {
        passwordResetInProgress: false,
        passwordResetWasSent: false,
        snackbarIsOpen: false,
        email: new FormControlState({
            value: '',
            validators: [
                emailValidator,
                requiredValidator('An email is required'),
            ]
        }).markAsInvalid(),
    }

    public componentDidMount(): void {
        this._isMounted = true;
    }

    public componentWillUnmount(): void {
        this._isMounted = false;
    }

    public render() {
        const {
            resetPasswordContainer,
            controlContainer,
            actionItemContainer,
            link,
            linkContainer,
        } = createResetPasswordClasses(this.props, this.state);

        const {
            email,
        } = this.state;

        const emailError = email.shouldShowError() ? email.errors[0] : undefined;

        return (
            <div className={resetPasswordContainer}>
                <div className={controlContainer}>
                    <FormControl required={true} fullWidth={true} error={this.state.email.shouldShowError()}>
                        <InputLabel>Email To Reset</InputLabel>
                        <Input
                            name="email"
                            value={this.state.email.value}
                            onChange={this.handleFormControlChange}
                        />
                        <FormHelperText>{emailError}</FormHelperText>
                    </FormControl>
                    <div className={linkContainer}>
                        <Typography className={link} variant="caption" onClick={this.navigateToLogin}>Login</Typography>
                    </div>
                    <div className={actionItemContainer}>
                        <AsyncButton
                            disabled={email.invalid || this.state.passwordResetInProgress}
                            asyncActionInProgress={this.state.passwordResetInProgress}
                            onClick={this.sendPasswordResetEmail}
                            color="primary"
                            variant="contained"
                        >
                            Reset Password
                        </AsyncButton>
                    </div>
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
                                {this.state.passwordResetWasSent ? (
                                    'Success! Check your email to reset your password.'
                                ): (
                                    'Oops, make sure to type your email in the \'Email\' section before clicking \'Reset Password\'.'
                                )}
                            </span>
                        )
                    }
                    onClose={this.handleSnackbarClose}
                />
            </div>
        )
    }

    private navigateToLogin = (): void => {
        this.props.history.push('login');
    }

    private handleFormControlChange = (event: any): void => {
        const formControl: FormControlState<string> = this.state[event.target.name];
        const controlToSetOnState = formControl.setValue(event.target.value);
        const name: 'fullName' | 'companyName' | 'email' | 'password' = event.target.name;

        if (this._isMounted) {
            this.setState({
                [name]: controlToSetOnState,
            } as any);
        }
    }

    private handleSnackbarClose = (): void => {
        if (this._isMounted) {
            this.setState({
                snackbarIsOpen: false,
            })
        }
    }

    private sendPasswordResetEmail = async(): Promise<void> => {
        if (this.state.passwordResetInProgress) {
            return;
        }

        if (this._isMounted) {
            this.setState({
                passwordResetInProgress: true,
            })
        }

        const emailAddress = this.state.email.value;
        try {
            await firebase.auth().sendPasswordResetEmail(emailAddress);
        } catch {
            // tslint:disable-next-line:no-console
            console.log('email was not sent');

            if (this._isMounted) {
                this.setState({
                    passwordResetInProgress: false,
                    passwordResetWasSent: false,
                    snackbarIsOpen: true,
                })
            }
            return;
        }

        if (this._isMounted) {
            this.setState({
                passwordResetInProgress: false,
                passwordResetWasSent: true,
                snackbarIsOpen: true,
            })
        }

        // tslint:disable-next-line:no-console
        console.log('email was sent');
    }
}

export const ResetPassword = withTheme()(ResetPasswordPresentation);