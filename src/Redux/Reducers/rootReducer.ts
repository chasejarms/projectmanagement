import { combineReducers } from 'redux';
import { IProjectCreationSliceOfState, projectCreationReducer } from './projectCreationReducer';
import { IUserSliceOfState, userReducer } from './userReducer';

export interface IAppState {
    projectCreation: IProjectCreationSliceOfState;
    userState: IUserSliceOfState;
}

export const rootReducer = combineReducers({
    projectCreation: projectCreationReducer,
    userState: userReducer,
});