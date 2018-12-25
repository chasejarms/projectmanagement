import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Authenticated } from '../Authenticated/Authenticated';

import { RouteGuard } from 'src/Components/RouteGuard/RouteGuard';
import { Roles } from '../../Models/roles';
import { CompanySelection } from '../CompanySelection/CompanySelection';
import { Login } from '../Login/Login';
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
              mustHaveRole={[Roles.Admin, Roles.Customer, Roles.Staff]}
              path="/company/:companyName"
              component={Authenticated}
            />
            <Route
              path="/companySelection"
              component={CompanySelection}
            />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export const Main = withRouter(MainPresentation);