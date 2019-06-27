import * as DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import * as React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { Main } from './Pages/Main/Main';
import { configureStore } from './Redux/configureStore';

const store = configureStore();
const RouterContext = React.createContext(null);

class App extends React.Component {
  public render() {
    return (
        <BrowserRouter>
          <Route>
                <Provider store={store}>
                  <DragDropContextProvider backend={HTML5Backend}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils.default}>
                      <Main/>
                    </MuiPickersUtilsProvider>
                  </DragDropContextProvider>
                </Provider>
          </Route>
        </BrowserRouter>
    );
  }
}

export function useRouter() {
  return React.useContext(RouterContext);
}

export default App;
