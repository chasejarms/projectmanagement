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
      <DragDropContextProvider backend={HTML5Backend}>
        <Provider store={store}>
          <BrowserRouter>
            <Main/>
          </BrowserRouter>
        </Provider>
      </DragDropContextProvider>
    );
  }
}

export default App;
