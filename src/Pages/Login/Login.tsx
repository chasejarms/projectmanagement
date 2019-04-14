import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    Snackbar,
    Typography,
} from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import * as React from 'react';
import { emailValidator } from 'src/Validators/email.validator';
import { passwordValidator } from 'src/Validators/password.validator';
import Api from '../../Api/api';
import { FormControlState } from '../../Classes/formControlState';
import { AsyncButton } from '../../Components/AsyncButton/AsyncButton';
import firebase from '../../firebase';
import { requiredValidator } from '../../Validators/required.validator';
import { createAuthenticationClasses, ILoginPresentationProps, ILoginPresentationState } from './Login.ias';

export class LoginPresentation extends React.Component<
    ILoginPresentationProps,
    ILoginPresentationState
    > {
    public state: ILoginPresentationState = {
        email: new FormControlState({
            value: '',
            validators: [
                requiredValidator('An email is required'),
                emailValidator,
            ]
        }).markAsInvalid(),
        password: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A password is required'),
                passwordValidator,
            ],
        }).markAsInvalid(),
        loginActionInProgress: false,
        passwordResetInProgress: false,
        snackbarIsOpen: false,
        passwordResetWasSent: false,
        dialogIsOpen: false,
    };

    // tslint:disable-next-line:variable-name
    public _isMounted: boolean;

    public componentWillMount(): void {
        this._isMounted = true;
    }

    public componentWillUnmount(): void {
        this._isMounted = false;
    }

    public render() {
        const {
            loginContainer,
            loginRow,
            textField,
            actionContainer,
            actionButton,
            link,
            linkContainer,
        } = createAuthenticationClasses(this.props, this.state);

        const {
            email,
            password,
        } = this.state;

        const emailError = email.shouldShowError() ? email.errors[0] : undefined;
        const passwordError = password.shouldShowError() ? password.errors[0] : undefined;

        return (
            <div className={loginContainer}>
                <div className={loginRow}>
                    <FormControl required={true} className={textField} error={this.state.email.shouldShowError()}>
                        <InputLabel>Email</InputLabel>
                        <Input
                            name="email"
                            value={this.state.email.value}
                            onChange={this.handleFormControlChange}
                        />
                        <FormHelperText>{emailError}</FormHelperText>
                    </FormControl>
                </div>
                <div className={loginRow}>
                    <FormControl required={true} className={textField} error={this.state.password.shouldShowError()}>
                        <InputLabel>Password</InputLabel>
                        <Input
                            type="password"
                            name="password"
                            value={this.state.password.value}
                            onChange={this.handleFormControlChange}
                        />
                        <FormHelperText>{passwordError}</FormHelperText>
                    </FormControl>
                </div>
                <div className={`${loginRow} ${linkContainer}`}>
                    <Typography className={link} variant="caption" onClick={this.sendPasswordResetEmail}>Reset Password</Typography>
                </div>
                <div className={`${loginRow} ${actionContainer}`}>
                    <div className={actionButton}>
                        <AsyncButton
                            disabled={!this.allControlsAreValid() || this.state.loginActionInProgress}
                            asyncActionInProgress={this.state.loginActionInProgress}
                            onClick={this.login}
                            color="primary"
                            variant="contained"
                        >
                            Login
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
                                    'Oops! It looks like there was an error.'
                                )}
                            </span>
                        )
                    }
                    onClose={this.handleSnackbarClose}
                />
                <Dialog
                    open={this.state.dialogIsOpen}
                    onClose={this.handleDialogClose}
                >
                    <DialogTitle>Error Logging In</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The username or password is invalid. Please try again or click on the reset password link if the problem persists.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary" autoFocus={true}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    private handleDialogClose = (): void => {
        this.setState({
            dialogIsOpen: false,
        })
    }

    private handleSnackbarClose = (): void => {
        this.setState({
            snackbarIsOpen: false,
        })
    }

    private login = async() => {
        if (this._isMounted) {
            this.setState({
                loginActionInProgress: true,
            });
        }

        let userCredential: firebase.auth.UserCredential;

        try {
            userCredential = await Api.authenticationApi.login(
                this.state.email.value,
                this.state.password.value);
        } catch (e) {
            this.setState({
                dialogIsOpen: true,
                loginActionInProgress: false,
            })

            return;
        }

        if (this._isMounted) {
            this.setState({
                loginActionInProgress: false,
            });
        };

        this.redirectToCompanySelection(userCredential.user!.uid);
    }

    private redirectToCompanySelection(uid: string): void {
        this.props.history.push(`companySelection?uid=${uid}`);
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

    private allControlsAreValid(): boolean {
        const {
            email,
            password,
        } = this.state;

        return !email.invalid && !password.invalid;
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

export const Login = withTheme()(LoginPresentation);