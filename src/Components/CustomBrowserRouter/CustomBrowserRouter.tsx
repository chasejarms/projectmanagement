import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";

export const RouterContext = React.createContext({});

export const CustomBrowserRouter = ({ children }: any) => (
  <BrowserRouter>
    <Route>
      {(routeProps) => (
        <RouterContext.Provider value={routeProps}>
          {children}
        </RouterContext.Provider>
      )}
    </Route>
  </BrowserRouter>
);
