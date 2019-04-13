import * as DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import * as React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Main } from './Pages/Main/Main';
import { configureStore } from './Redux/configureStore';

const store = configureStore();

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <DragDropContextProvider backend={HTML5Backend}>
            <MuiPickersUtilsProvider utils={DateFnsUtils.default}>
              <Main/>
            </MuiPickersUtilsProvider>
          </DragDropContextProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
