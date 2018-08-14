import * as React from 'react';
import { AppState } from '../../App';
import { connect, Dispatch } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router';
import firebase, { db } from '../../firebase';
import { SET_ADMIN } from '../../adminUser.reducer';
import { AdminRoutePresentationProps, AdminRoutePresentationState } from './AdminRoute.ias';

class AdminRoutePresentation extends React.Component<AdminRoutePresentationProps, AdminRoutePresentationState> {
  state = {
    userHasAdminRight: undefined,
  };

  componentWillMount(): void {
    if (this.props.isAdmin) {
      this.setState({
        userHasAdminRight: true,
      });
      return;
    }

    this.verifyUserIsAdmin();
  }

  constructor(props: AdminRoutePresentationProps) {
    super(props);
  }

  render() {
    const { component: Component, path, ...rest } = this.props;
    const { userHasAdminRight }  = this.state;
    if (userHasAdminRight  === undefined) {
      return <p>loading</p>;
    } else {
      return (
        <Route
          {...rest}
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

const mapStateToProps = ({ isAdmin }: AppState) => ({
  isAdmin
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>) => ({
  setIsAdmin: (isAdmin: boolean) => {
    dispatch({
      type: SET_ADMIN,
      isAdmin,
    });
  },
});

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(AdminRoutePresentation);
export const AdminRoute = withRouter(connectedComponent);