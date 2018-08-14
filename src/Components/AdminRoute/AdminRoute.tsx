import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router';
import { SET_ADMIN } from '../../adminUser.reducer';
import { IAppState } from '../../App';
import firebase, { db } from '../../firebase';
import { IAdminRoutePresentationProps, IAdminRoutePresentationState } from './AdminRoute.ias';

class AdminRoutePresentation extends React.Component<IAdminRoutePresentationProps, IAdminRoutePresentationState> {
  public state = {
    userHasAdminRight: undefined,
  };

  constructor(props: IAdminRoutePresentationProps) {
    super(props);
  }

  public componentWillMount(): void {
    if (this.props.isAdmin) {
      this.setState({
        userHasAdminRight: true,
      });
      return;
    }

    this.verifyUserIsAdmin();
  }

  public render() {
    const { component: Component, path, ...rest } = this.props;
    const { userHasAdminRight }  = this.state;
    if (userHasAdminRight  === undefined) {
      return <p>loading</p>;
    } else {
      return (
        <Route
          {...rest}
          // tslint:disable-next-line:jsx-no-lambda
          render={(props) => (
            userHasAdminRight
              ? <Component {...props} />
              : <Redirect to="/admin" />
          )}
        />
      );
    }
  }

  private verifyUserIsAdmin(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          userHasAdminRight: false,
        });
        return;
      }

      db.collection('users').doc(user!.uid).get().then((innerUser) => {
        const isAdmin = !!innerUser.data()!.roles.admin;
        this.setState({
          userHasAdminRight: isAdmin,
        });
        this.props.setIsAdmin(isAdmin);
      });
    });
  }
}

const mapStateToProps = ({ isAdmin }: IAppState) => ({
  isAdmin
});

const mapDispatchToProps = (dispatch: Dispatch<IAppState>) => ({
  setIsAdmin: (isAdmin: boolean) => {
    dispatch({
      isAdmin,
      type: SET_ADMIN,
    });
  },
});

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(AdminRoutePresentation);
export const AdminRoute = withRouter(connectedComponent);