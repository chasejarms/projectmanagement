import * as React from 'react';
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
          <Main/>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
