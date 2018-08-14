import { combineReducers } from 'redux';
import { adminUserReducer } from './adminUser.reducer';

export const reducer = combineReducers({
  isAdmin: adminUserReducer,
});