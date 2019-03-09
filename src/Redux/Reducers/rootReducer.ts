import { combineReducers } from 'redux';
import { IUserSliceOfState, userReducer } from './userReducer';

export interface IAppState {
    userState: IUserSliceOfState;
}

export const rootReducer = combineReducers({
    userState: userReducer,
});