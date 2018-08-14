import * as React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Authentication } from '../Authentication/Authentication';
import { AdminRoute } from '../../Components/AdminRoute/AdminRoute';

import {
  createMainClasses,
  MainPresentationProps,
  MainPresentationState,
} from './Main.ias';

class MainPresentation extends React.Component<MainPresentationProps, MainPresentationState> {

  render() {
    const {
      appContainer,
    } = createMainClasses(this.props, this.state);

    return (
      <div className={appContainer}>
        {GA.init() && <GA.RouteTracker />}
        <Switch>
          <Route
            exact={true}
            path="/"
            component={Posts}
          />
          <Route
            path="/admin"
            component={Authentication}
          />
          <AdminRoute
            path="/new"
            component={Post}
          />
          <Route
            path="/posts/:lowercasePostTitle"
            component={Post}
          />
        </Switch>
      </div>
    );
  }
}

export const Main = withRouter(MainPresentation);