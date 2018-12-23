import {
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    Typography,
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
    };

    public render() {
        const {
            signUpContainer,
            signUpRow,
            textField,
            actionContainer,
            actionButton,
            link,
            linkContainer,
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
                <div className={`${signUpRow} ${linkContainer}`}>
                    <Typography className={link} variant="caption">Create a company with an existing user</Typography>
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
            </div>
        );
    }

    private signUp = () => {
        this.setState({
            signUpActionInProgress: true,
        });
        Api.authenticationApi.signUp(
            this.state.companyName.value,
            this.state.fullName!.value,
            this.state.email.value,
            this.state.password.value,
        ).then(() => {
            this.setState({
                signUpActionInProgress: false,
            });
            this.redirectToCompanySelection();
        }).catch((error) => {
            const newCompanyNameControl = this.state.companyName.createCopy()
                .markAsInvalid()
                .setError(error.message);

            this.setState({
                companyName: newCompanyNameControl,
                signUpActionInProgress: false,
            });
        });
    }

    private redirectToCompanySelection(): void {
        this.props.history.push('companySelection');
    }

    private handleFormControlChange = (event: any): void => {
        const formControl: FormControlState<string> = this.state[event.target.name];
        const controlToSetOnState = formControl.setValue(event.target.value);
        const name: 'fullName' | 'companyName' | 'email' | 'password' = event.target.name;

        this.setState({
            [name]: controlToSetOnState,
        } as any);
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