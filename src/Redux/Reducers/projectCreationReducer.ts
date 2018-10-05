import { Action } from 'redux';
import { ICheckpoint } from '../../Models/checkpoint';
import { GET_INITIAL_CHECKPOINTS } from '../Actions/projectCreationActions';

type ProjectCreationActionType = typeof GET_INITIAL_CHECKPOINTS;

interface IProjectCreationAction extends Action<ProjectCreationActionType> {
  isAdmin: boolean;
}

interface IProjectCreationState {
    projectName: string;
    checkpoints: ICheckpoint[];
}

const initialState = {
  projectName: '',
  checkpoints: [],
}

export const projectCreationReducer = (state: IProjectCreationState = initialState, action: IProjectCreationAction) => {
  switch (action.type) {
    case GET_INITIAL_CHECKPOINTS:
      return action;
    default:
      return state;
  }
}