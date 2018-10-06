import { combineReducers } from 'redux';
import { IProjectCreationSliceOfState, projectCreationReducer } from './projectCreationReducer';

export interface IAppState {
    projectCreation: IProjectCreationSliceOfState;
}

export const rootReducer = combineReducers({
    projectCreation: projectCreationReducer,
});