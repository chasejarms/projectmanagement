import {
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
import { createAuthenticationClasses, IAuthenticationPresentationProps, IAuthenticationPresentationState } from './Authentication.ias';

export class AuthenticationPresentation extends React.Component<
    IAuthenticationPresentationProps,
    IAuthenticationPresentationState
    > {
    public state: IAuthenticationPresentationState = {
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
        authenticationActionInProgress: false,
    };

    public render() {
        const authenticationText = this.isLoginUrl() ? 'Login' : 'Sign Up';
        const authenticationAction = this.isLoginUrl() ? this.login : this.signup;

        const {
            authenticationContainer,
            authenticationRow,
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
        const fullNameField = this.isLoginUrl() ? undefined : (
            <div className={authenticationRow}>
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
        );

        const companyNameError = companyName.shouldShowError() ? companyName.errors[0] : undefined;
        const emailError = email.shouldShowError() ? email.errors[0] : undefined;
        const passwordError = password.shouldShowError() ? password.errors[0] : undefined;

        return (
            <div className={authenticationContainer}>
                <div className={authenticationRow}>
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
                {fullNameField}
                <div className={authenticationRow}>
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
                <div className={authenticationRow}>
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
                <div className={`${authenticationRow} ${actionContainer}`}>
                    <div className={actionButton}>
                        <AsyncButton
                            disabled={!this.allControlsAreValid() || this.state.authenticationActionInProgress}
                            asyncActionInProgress={this.state.authenticationActionInProgress}
                            onClick={authenticationAction}
                            color="primary"
                            variant="contained"
                        >
                            {authenticationText}
                        </AsyncButton>
                    </div>
                </div>
            </div>
        );
    }

    private login = () => {
        this.setState({
            authenticationActionInProgress: true,
        });
        const modifiedCompanyName = this.state.companyName!.value.trim().toLowerCase();
        Api.authenticationApi.login(
            modifiedCompanyName,
            this.state.email.value,
            this.state.password.value,
        ).then(() => {
            this.setState({
                authenticationActionInProgress: false,
            });
            this.redirectToCompanyPage();
        }).catch((error) => {
            this.setState({
                authenticationActionInProgress: false,
            });
            // tslint:disable-next-line:no-console
            console.log('there was an error: ', error);
        });
    }

    private signup = () => {
        this.setState({
            authenticationActionInProgress: true,
        });
        Api.authenticationApi.signUp(
            this.state.companyName.value,
            this.state.fullName!.value,
            this.state.email.value,
            this.state.password.value,
        ).then(() => {
            this.setState({
                authenticationActionInProgress: false,
            });
            this.redirectToCompanyPage();
        }).catch((error) => {
            const newCompanyNameControl = this.state.companyName.createCopy()
                .markAsInvalid()
                .setError(error.message);

            this.setState({
                companyName: newCompanyNameControl,
                authenticationActionInProgress: false,
            });
        });
    }

    private isLoginUrl(): boolean {
        return this.props.match.path === '/login';
    }

    private redirectToCompanyPage(): void {
        const companyName = this.state.companyName.value;
        this.props.history.push(`company/${companyName}`);
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

        const fullNameIsValid = this.isLoginUrl() ? true : !fullName!.invalid;

        return fullNameIsValid && !email.invalid && !password.invalid && !companyName.invalid;
    }
}

export const Authentication = withTheme()(AuthenticationPresentation);