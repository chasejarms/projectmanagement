import { ICheckpoint } from '../../Models/checkpoint';
import { IProjectCreationActions, IProjectCreationAddCheckpointAction, IProjectCreationNameUpdateAction, IProjectCreationRemoveCheckpointAction } from './../ActionCreators/projectCreationActionCreators';
import { ADD_CHECKPOINT, DELETE_CHECKPOINT, SET_PROJECT_NAME } from './../Actions/projectCreationActions';

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
      const checkpointsAfterAddedCheckpoint = state.checkpoints.concat([addCheckpointAction.checkpoint]);
      return {
        ...state,
        checkpoints: checkpointsAfterAddedCheckpoint,
      };
    case DELETE_CHECKPOINT:
      const deleteCheckpointAction = action as IProjectCreationRemoveCheckpointAction;
      const checkpointsAfterDeletedCheckpoint = state.checkpoints.filter((checkpoint, index) => {
        return index !== deleteCheckpointAction.index;
      });

      return {
        ...state,
        checkpoints: checkpointsAfterDeletedCheckpoint,
      }
    default:
      return state;
  }
}