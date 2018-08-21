import { Button, TextField } from '@material-ui/core';
// import { User } from 'firebase';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CLEAR_ADMIN_STATE } from '../../adminUser.reducer';
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
    };

    // private signUpFunctionName = 'createUserWithEmailAndPassword';
    // private loginFunctionName = 'signInWithEmailAndPassword';

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

        const companyNameField = this.isLoginUrl() ? undefined : (
            <TextField
                className={textField}
                autoFocus={true}
                label="Company Name"
                name="companyName"
                value={this.state.companyName}
                onChange={this.handleChange}
            />
        )

        return (
            <div className={authenticationContainer}>
                <div className={authenticationRow}>
                    { companyNameField }
                </div>
                <div className={authenticationRow}>
                    <TextField
                        className={textField}
                        autoFocus={this.isLoginUrl()}
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
        // this.redirectToCompanyPage();
        // this.sharedAuthFunctionality(true);
    }

    private signup = () => {
        this.redirectToCompanyPage();
        // this.sharedAuthFunctionality(false);
    }

    // private logout(): void {
    //       firebase.auth().signOut().then(() => {
    //         // tslint:disable-next-line:no-console
    //         console.log('successfully signed out');
    //       }).catch((error) => {
    //         // tslint:disable-next-line:no-console
    //         console.log(error);
    //       });
    // }

    private isLoginUrl(): boolean {
        return this.props.match.path === '/login';
    }

    // private sharedAuthFunctionality(isLogin: boolean) {
    //     const authFunctionName = isLogin ? this.loginFunctionName : this.signUpFunctionName;
    //     firebase.auth()[authFunctionName](
    //         this.state.email,
    //         this.state.password,
    //     ).then((userInfo: User) => {
    //         // this.potentiallySetUserRole(authFunctionName, userInfo.uid);
    //         this.setState({
    //             email: '',
    //             password: '',
    //         });
    //     })
    //     .catch((error: any) => {
    //         // tslint:disable-next-line:no-console
    //         console.log(error);
    //     });
    // }

    private redirectToCompanyPage(): void {
        // tslint:disable-next-line:no-console
        console.log(this.state);
        const company = this.state.companyName || 'xactware';
        this.props.history.push(`company/${company}`);
    }

    // private potentiallySetUserRole(authFunctionName: string, userId: string): void {
    //     if (authFunctionName === this.signUpFunctionName) {
    //         console.log('something');
    //     }
    // }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearAdminState: () => {
    dispatch({
      type: CLEAR_ADMIN_STATE,
    });
  }
});

export const Authentication = connect(undefined, mapDispatchToProps)(AuthenticationPresentation);