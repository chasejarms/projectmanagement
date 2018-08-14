import * as React from 'react';
import { handleChange } from '../../Utils/handleChange';
import { User } from 'firebase';
import firebase from '../../firebase';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CLEAR_ADMIN_STATE } from '../../adminUser.reducer';
import { AuthenticationPresentationProps, AuthenticationPresentationState } from './Authentication.ias';

export class AuthenticationPresentation extends React.Component<
    AuthenticationPresentationProps,
    AuthenticationPresentationState
    > {
    state: AuthenticationPresentationState = {
        email: '',
        password: ''
    };

    signUpFunctionName = 'createUserWithEmailAndPassword';
    loginFunctionName = 'signInWithEmailAndPassword';

    handleChange = handleChange(this);

    constructor(props: AuthenticationPresentationProps) {
        super(props);
    }

    login = () => {
        this.sharedAuthFunctionality(true);
    }

    signup = () => {
        this.sharedAuthFunctionality(false);
    }

    render() {
        const authenticationText = this.isLoginUrl() ? 'Login' : 'Sign Up';
        const authenticationAction = this.isLoginUrl() ? this.login : this.signup;

        return (
            <div>
                <input
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    placeholder="email"
                />
                <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    placeholder="password"
                />
                <button onClick={authenticationAction}>{authenticationText}</button>
                <button onClick={this.logout}>Log out</button>
            </div>
        );
    }

    private logout(): void {
          firebase.auth().signOut().then(() => {
            console.log('successfully signed out');
          }).catch((error) => {
            console.log(error);
          });
    }

    private isLoginUrl(): boolean {
        return this.props.match.path === '/admin';
    }

    private sharedAuthFunctionality(isLogin: boolean) {
        const authFunctionName = isLogin ? this.loginFunctionName : this.signUpFunctionName;
        firebase.auth()[authFunctionName](
            this.state.email,
            this.state.password,
        ).then((userInfo: User) => {
            // this.potentiallySetUserRole(authFunctionName, userInfo.uid);
            this.setState({
                email: '',
                password: '',
            });
        })
        .catch((error: any) => {
            console.log(error);
        });
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