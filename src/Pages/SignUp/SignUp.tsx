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
} from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import * as React from 'react';
import { companyNameValidator } from 'src/Validators/companyName.validator';
import { emailValidator } from 'src/Validators/email.validator';
import { passwordValidator } from 'src/Validators/password.validator';
import Api from '../../Api/api';
import { FormControlState } from '../../Classes/formControlState';
import { AsyncButton } from '../../Components/AsyncButton/AsyncButton';
import { requiredValidator } from '../../Validators/required.validator';
import { createAuthenticationClasses, ISignUpPresentationProps, ISignUpPresentationState } from './SignUp.ias';

export class SignUpPresentation extends React.Component<
    ISignUpPresentationProps,
    ISignUpPresentationState
    > {
    public state: ISignUpPresentationState = {
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
        companyName: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A company name is required'),
                companyNameValidator,
            ],
        }).markAsInvalid(),
        fullName: new FormControlState({
            value: '',
            validators: [requiredValidator('A full name is required')],
        }).markAsInvalid(),
        signUpActionInProgress: false,
        dialogIsOpen: false,
        signUpError: '',
    };

    // tslint:disable-next-line:variable-name
    private _isMounted: boolean;

    public componentWillMount(): void {
        this._isMounted = true;
    }

    public componentWillUnmount(): void {
        this._isMounted = false;
    }

    public render() {
        const {
            signUpContainer,
            signUpRow,
            textField,
            actionContainer,
            actionButton,
        } = createAuthenticationClasses(this.props, this.state);

        const {
            fullName,
            companyName,
            email,
            password,
        } = this.state;

        const fullNameError = fullName!.shouldShowError() ? fullName!.errors[0] : undefined;
        const companyNameError = companyName.shouldShowError() ? companyName.errors[0] : undefined;
        const emailError = email.shouldShowError() ? email.errors[0] : undefined;
        const passwordError = password.shouldShowError() ? password.errors[0] : undefined;

        return (
            <div className={signUpContainer}>
                <div className={signUpRow}>
                    <FormControl required={true} className={textField} error={this.state.companyName.shouldShowError()}>
                        <InputLabel>Company Name</InputLabel>
                        <Input
                            autoFocus={true}
                            name="companyName"
                            value={this.state.companyName.value}
                            onChange={this.handleFormControlChange}
                        />
                        <FormHelperText>{companyNameError}</FormHelperText>
                    </FormControl>
                </div>
                <div className={signUpRow}>
                    <FormControl required={true} className={textField} error={fullName!.shouldShowError()}>
                        <InputLabel>Full Name</InputLabel>
                        <Input
                            name="fullName"
                            value={this.state.fullName!.value}
                            onChange={this.handleFormControlChange}
                        />
                        <FormHelperText>{fullNameError}</FormHelperText>
                    </FormControl>
                </div>
                <div className={signUpRow}>
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
                <div className={signUpRow}>
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
                <div className={`${signUpRow} ${actionContainer}`}>
                    <div className={actionButton}>
                        <AsyncButton
                            disabled={!this.allControlsAreValid() || this.state.signUpActionInProgress}
                            asyncActionInProgress={this.state.signUpActionInProgress}
                            onClick={this.signUp}
                            color="primary"
                            variant="contained"
                        >
                            Sign Up
                        </AsyncButton>
                    </div>
                </div>
                <Dialog
                    open={this.state.dialogIsOpen}
                    onClose={this.handleDialogClose}
                >
                    <DialogTitle>Error Signing Up</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            A user with that email already exists in the system.
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
        if (this._isMounted) {
            this.setState({
                dialogIsOpen: false,
            })
        }
    }

    private signUp = async() => {
        if (this._isMounted) {
            this.setState({
                signUpActionInProgress: true,
            });
        }

        try {
            await Api.authenticationApi.signUp(
                this.state.companyName.value,
                this.state.fullName!.value,
                this.state.email.value,
                this.state.password.value,
            )

            const userCredential = await Api.authenticationApi.login(
                this.state.email.value,
                this.state.password.value,
            )

            this.redirectToCompanySelection(userCredential.user!.uid);
        } catch (error) {
            if (this._isMounted) {
                this.setState({
                    signUpActionInProgress: false,
                    dialogIsOpen: true,
                    signUpError: error.message,
                })
            }
        }
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
            fullName,
            email,
            password,
            companyName,
        } = this.state;

        return !fullName.invalid && !email.invalid && !password.invalid && !companyName.invalid;
    }
}

export const SignUp = withTheme()(SignUpPresentation);