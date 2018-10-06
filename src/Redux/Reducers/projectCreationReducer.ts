import { ICheckpoint } from '../../Models/checkpoint';
import { IProjectCreationActions, IProjectCreationAddCheckpointAction, IProjectCreationNameUpdateAction } from './../ActionCreators/projectCreationActionCreators';
import { ADD_CHECKPOINT, SET_PROJECT_NAME } from './../Actions/projectCreationActions';

export interface IProjectCreationSliceOfState {
    projectName: string;
    checkpoints: ICheckpoint[];
}

const initialState = {
  projectName: '',
  checkpoints: [],
}

export const projectCreationReducer = (state: IProjectCreationSliceOfState = initialState, action: IProjectCreationActions): IProjectCreationSliceOfState => {
  switch (action.type) {
    case SET_PROJECT_NAME:
      const projectNameAction = action as IProjectCreationNameUpdateAction;
      return {
        ...state,
        projectName: projectNameAction.projectName,
      };
    case ADD_CHECKPOINT:
      const addCheckpointAction = action as IProjectCreationAddCheckpointAction;
      const checkpoints = state.checkpoints.concat([addCheckpointAction.checkpoint]);
      return {
        ...state,
        checkpoints,
      };
    default:
      return state;
  }
}