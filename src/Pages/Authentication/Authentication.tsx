import { TextField } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
// import { User } from 'firebase';
import * as React from 'react';
import Api from '../../Api/api';
import { AsyncButton } from '../../Components/AsyncButton/AsyncButton';
// import firebase from '../../firebase';
import { handleChange } from '../../Utils/handleChange';
import { createAuthenticationClasses, IAuthenticationPresentationProps, IAuthenticationPresentationState } from './Authentication.ias';

export class AuthenticationPresentation extends React.Component<
    IAuthenticationPresentationProps,
    IAuthenticationPresentationState
    > {
    public state: IAuthenticationPresentationState = {
        email: '',
        password: '',
        companyName: '',
        fullName: '',
        authenticationActionInProgress: false,
    };

    private handleChange = handleChange(this);

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

        const fullNameField = this.isLoginUrl() ? undefined : (
            <TextField
                className={textField}
                label="Full Name"
                name="fullName"
                value={this.state.fullName}
                onChange={this.handleChange}
                margin="normal"
            />
        )

        return (
            <div className={authenticationContainer}>
                <div className={authenticationRow}>
                    <TextField
                        className={textField}
                        autoFocus={true}
                        label="Company Name"
                        name="companyName"
                        value={this.state.companyName}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                </div>
                <div className={authenticationRow}>
                    { fullNameField }
                </div>
                <div className={authenticationRow}>
                    <TextField
                        className={textField}
                        label="Email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                </div>
                <div className={authenticationRow}>
                    <TextField
                        className={textField}
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        label="Password"
                        margin="normal"
                    />
                </div>
                <div className={`${authenticationRow} ${actionContainer}`}>
                    <AsyncButton
                        disabled={this.state.authenticationActionInProgress}
                        asyncActionInProgress={this.state.authenticationActionInProgress}
                        className={actionButton}
                        onClick={authenticationAction}
                        color="primary"
                        variant="contained"
                    >
                        {authenticationText}
                    </AsyncButton>
                </div>
            </div>
        );
    }

    private login = () => {
        this.setState({
            authenticationActionInProgress: true,
        });
        const modifiedCompanyName = this.state.companyName!.trim().toLowerCase();
        Api.authenticationApi.login(
            modifiedCompanyName,
            this.state.email,
            this.state.password,
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
            this.state.companyName,
            this.state.fullName!,
            this.state.email,
            this.state.password,
        ).then(() => {
            this.setState({
                authenticationActionInProgress: false,
            });
            this.redirectToCompanyPage();
        }).catch((message) => {
            // tslint:disable-next-line:no-console
            console.log(message);
            this.setState({
                authenticationActionInProgress: false,
            });
        });
    }

    private isLoginUrl(): boolean {
        return this.props.match.path === '/login';
    }

    private redirectToCompanyPage(): void {
        const company = this.state.companyName || 'xactware';
        this.props.history.push(`company/${company}`);
    }
}

export const Authentication = withTheme()(AuthenticationPresentation);