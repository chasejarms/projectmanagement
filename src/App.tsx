import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Main } from './Pages/Main/Main';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { reducer } from './reducer';

export interface AppState {
  isAdmin: boolean;
}

const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Main/>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
