import * as DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import * as React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { CustomBrowserRouter } from './Components/CustomBrowserRouter/CustomBrowserRouter';
import { Main } from './Pages/Main/Main';
import { configureStore } from './Redux/configureStore';

const store = configureStore();
const theme = createMuiTheme();

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <CustomBrowserRouter>
          <DragDropContextProvider backend={HTML5Backend}>
            <ThemeProvider theme={theme}>
              <MuiPickersUtilsProvider utils={DateFnsUtils.default}>
                <Main/>
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </DragDropContextProvider>
        </CustomBrowserRouter>
      </Provider>
    );
  }
}

export default App;
