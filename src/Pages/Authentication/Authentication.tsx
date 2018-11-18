import { Button, TextField } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
// import { User } from 'firebase';
import * as React from 'react';
import Api from '../../Api/api';
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
                    <Button
                        className={actionButton}
                        variant="contained"
                        onClick={authenticationAction}
                        color="primary">{authenticationText}
                    </Button>
                </div>
            </div>
        );
    }

    private login = () => {
        const modifiedCompanyName = this.state.companyName!.trim().toLowerCase();
        Api.authenticationApi.login(
            modifiedCompanyName,
            this.state.email,
            this.state.password,
        ).then(() => {
            this.redirectToCompanyPage();
        }).catch((error) => {
            // tslint:disable-next-line:no-console
            console.log('there was an error: ', error);
        });
    }

    private signup = () => {
        Api.authenticationApi.signUp(
            this.state.companyName,
            this.state.fullName!,
            this.state.email,
            this.state.password,
        ).then(() => {
            this.redirectToCompanyPage();
        }).catch((message) => {
            // tslint:disable-next-line:no-console
            console.log(message);
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