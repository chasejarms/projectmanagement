import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Authentication } from '../Authentication/Authentication';
// import { AdminRoute } from '../../Components/AdminRoute/AdminRoute';

import {
  IMainPresentationProps,
  IMainPresentationState,
} from './Main.ias';

class MainPresentation extends React.Component<IMainPresentationProps, IMainPresentationState> {
  public render() {
    return (
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
          />
        </Switch>
      </div>
    );
  }
}

export const Main = withRouter(MainPresentation);