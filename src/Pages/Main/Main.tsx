import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Authentication } from '../Authentication/Authentication';
import { Project } from '../Project/Project';
import { Projects } from '../Projects/Projects';
// import { AdminRoute } from '../../Components/AdminRoute/AdminRoute';

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
              exact={true}
              component={Projects}
            />
            <Route
              path="/company/:companyName/project/:projectId"
              component={Project}/>
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export const Main = withRouter(MainPresentation);