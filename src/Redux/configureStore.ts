import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './Reducers/rootReducer';

export function configureStore() {
  return createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
  );
}