import { combineReducers } from 'redux';
import { projectCreationReducer } from './projectCreationReducer';

export const rootReducer = combineReducers({
    projectCreation: projectCreationReducer,
});