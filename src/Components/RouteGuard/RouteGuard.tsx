import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router';
import { IUser } from 'src/Models/user';
import { setCurrentUser } from 'src/Redux/ActionCreators/userActionCreators';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import firebase, { db } from '../../firebase';
import { createRouteGuardClasses, IRouteGuardPresentationProps, IRouteGuardPresentationState } from './RouteGuard.ias';

class RouteGuardPresentation extends React.Component<IRouteGuardPresentationProps, IRouteGuardPresentationState> {
  public state = {
    userCanViewPage: undefined,
  };

  constructor(props: IRouteGuardPresentationProps) {
    super(props);
  }

  public componentWillMount(): void {
    if (!!this.props.user.user) {
      this.setViewRights(this.props.user.user!);
    } else {
      this.verifyUserIsAdmin();
    }
  }

  public render() {
    const { component: Component, path, ...rest } = this.props;
    const { userCanViewPage }  = this.state;

    const {
      loadingPageContainer,
    } = createRouteGuardClasses(this.props, this.state);

    if (userCanViewPage  === undefined) {
      return (
        <div className={loadingPageContainer}>
          <CircularProgress
            color="primary"
            size={64}
            thickness={3}
          />
        </div>
      );
    } else {
      return (
        <Route
          {...rest}
          // tslint:disable-next-line:jsx-no-lambda
          render={(props) => (
            userCanViewPage
              ? <Component {...props} />
              : <Redirect to="/login" />
          )}
        />
      );
    }
  }

  private verifyUserIsAdmin(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          userCanViewPage: false,
        });
        return;
      }

      const companyName = this.props.location.pathname.split('/')[2];

      db.collection('companies').doc(companyName).collection('users').doc(user!.uid).get().then((userDocumentSnapshot) => {
        if (!userDocumentSnapshot.exists) {
          this.setState({
            userCanViewPage: false,
          });
          return;
        }

        const userData = userDocumentSnapshot.data()! as IUser;
        this.setViewRights(userData);
      });
    });
  }

  private setViewRights = (user: IUser) => {
    const userHasRole = this.props.mustHaveRole.some((compareRole) => compareRole === user.type);

    if (userHasRole) {
      this.setState({
        userCanViewPage: true,
      })
    } else {
      this.setState({
        userCanViewPage: false,
      })
    }
  }
}

const mapStateToProps = ({ user }: IAppState) => ({
  user
});

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
  setUser: (user: IUser) => {
    const setCurrentUserAction = setCurrentUser(user);
    dispatch(setCurrentUserAction);
  }
});

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(RouteGuardPresentation);
export const RouteGuard = withRouter(connectedComponent);