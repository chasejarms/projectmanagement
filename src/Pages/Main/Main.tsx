import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Authenticated } from '../Authenticated/Authenticated';
import { Authentication } from '../Authentication/Authentication';

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
          {/* {GA.init() && <GA.RouteTracker />} */}
          <Switch>
            <Route
              path="/signup"
              component={Authentication}
            />
            <Route
              path="/login"
              component={Authentication}
            />
            <Route
              path="/company/:companyName"
              component={Authenticated}
            />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export const Main = withRouter(MainPresentation);