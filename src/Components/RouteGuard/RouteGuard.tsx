import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router';
import { IUser } from 'src/Models/user';
import { setUserForCompany } from 'src/Redux/ActionCreators/userActionCreators';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import firebase, { db } from '../../firebase';
import { createRouteGuardClasses, IRouteGuardPresentationProps, IRouteGuardPresentationState } from './RouteGuard.ias';

class RouteGuardPresentation extends React.Component<IRouteGuardPresentationProps, IRouteGuardPresentationState> {
  public state: IRouteGuardPresentationState = {
    userCanViewPage: undefined,
    unsubscribe: undefined,
  };

  // tslint:disable-next-line:variable-name
  private _isMounted: boolean;

  constructor(props: IRouteGuardPresentationProps) {
    super(props);
  }

  public componentWillMount(): void {
    this._isMounted = true;
    const companyId = this.props.location.pathname.split('/')[2];
    const user = this.props.userState[companyId];

    if (!!user) {
      this.setViewRights(user);
    } else {
      this.verifyUserIsAdmin();
    }
  }

  public componentWillUnmount(): void {
    const unsubscribe = this.state.unsubscribe;
    if (unsubscribe) {
      unsubscribe();
    }
    this._isMounted = false;
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
    const unsubscribe = firebase.auth().onAuthStateChanged(async(user) => {
      if (!user) {
        if (this._isMounted) {
          this.setState({
            userCanViewPage: false,
          });
        }
        return;
      }

      const companyId = this.props.location.pathname.split('/')[2];

      const companyUserJoinQuerySnapshot = await db.collection('companyUserJoin')
        .where('companyId', '==', companyId)
        .where('firebaseAuthenticationUid', '==', user.uid)
        .get();

      if (companyUserJoinQuerySnapshot.empty) {
        if (this._isMounted) {
          this.setState({
            userCanViewPage: false,
          });
        }
        return;
      }

      const userDocumentSnapshot = await db.collection('users')
        .doc(companyUserJoinQuerySnapshot.docs[0].data().userId)
        .get();

      if (!userDocumentSnapshot.exists) {
        if (this._isMounted) {
          this.setState({
            userCanViewPage: false,
          });
        }
        return;
      }

      this.props.setUser(companyId, {
        ...userDocumentSnapshot.data() as IUser,
        id: userDocumentSnapshot.id,
      });

      const userData = userDocumentSnapshot.data()! as IUser;
      this.setViewRights(userData);
    });

    if (this._isMounted) {
      this.setState({
        unsubscribe,
      })
    }
  }

  private setViewRights = (user: IUser) => {
    const userHasRole = this.props.mustHaveRole.some((compareRole) => compareRole === user.type);

    if (userHasRole) {
      if (this._isMounted) {
        this.setState({
          userCanViewPage: true,
        })
      }
    } else {
      if (this._isMounted) {
        this.setState({
          userCanViewPage: false,
        })
      }
    }
  }
}

const mapStateToProps = ({ userState }: IAppState) => ({
  userState
});

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
  setUser: (companyId: string, user: IUser) => {
    const setCurrentUserAction = setUserForCompany(companyId, user);
    dispatch(setCurrentUserAction);
  }
});

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(RouteGuardPresentation);
export const RouteGuard = withRouter(connectedComponent);