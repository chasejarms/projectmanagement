import {
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
} from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import * as React from 'react';
import { emailValidator } from 'src/Validators/email.validator';
import { passwordValidator } from 'src/Validators/password.validator';
import Api from '../../Api/api';
import { FormControlState } from '../../Classes/formControlState';
import { AsyncButton } from '../../Components/AsyncButton/AsyncButton';
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
    };

    public render() {
        const {
            loginContainer,
            loginRow,
            textField,
            actionContainer,
            actionButton,
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
            </div>
        );
    }

    private login = async() => {
        this.setState({
            loginActionInProgress: true,
        });
        try {
            const userCredential = await Api.authenticationApi.login(
                this.state.email.value,
                this.state.password.value);

            this.setState({
                loginActionInProgress: false,
            });

            this.redirectToCompanySelection(userCredential.user!.uid);
        } catch (e) {
            const newEmailControl = this.state.email.createCopy()
                .markAsInvalid()
                .setError('The username or password is invalid');

            this.setState({
                email: newEmailControl,
                loginActionInProgress: false,
            });
        }
    }

    private redirectToCompanySelection(uid: string): void {
        this.props.history.push(`companySelection?uid=${uid}`);
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
            email,
            password,
        } = this.state;

        return !email.invalid && !password.invalid;
    }
}

export const Login = withTheme()(LoginPresentation);