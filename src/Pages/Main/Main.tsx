import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Authenticated } from '../Authenticated/Authenticated';

import { RouteGuard } from 'src/Components/RouteGuard/RouteGuard';
import { UserType } from 'src/Models/userTypes';
import { CompanySelection } from '../CompanySelection/CompanySelection';
import { Home } from '../Home/Home';
import { Login } from '../Login/Login';
import { ResetPassword } from '../ResetPassword/ResetPassword';
import { SignUp } from '../SignUp/SignUp';
import {
  IMainPresentationProps,
  IMainPresentationState,
} from './Main.ias';

const theme = createMuiTheme();

class MainPresentation extends React.Component<IMainPresentationProps, IMainPresentationState> {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Switch>
            <Route
              path="/signup"
              component={SignUp}
            />
            <Route
              path="/login"
              component={Login}
            />
            <RouteGuard
              mustHaveRole={[UserType.Admin, UserType.Doctor, UserType.Staff]}
              path="/company/:companyName"
              component={Authenticated}
            />
            <Route
              path="/companySelection"
              component={CompanySelection}
            />
            <Route
              path="/reset-password"
              component={ResetPassword}
            />
            <Route
              path="/"
              component={Home}
            />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export const Main = withRouter(MainPresentation);