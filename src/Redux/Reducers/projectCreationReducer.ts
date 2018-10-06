import { ICheckpoint } from '../../Models/checkpoint';
import { IProjectCreationActions, IProjectCreationAddCheckpointAction, IProjectCreationNameUpdateAction, IProjectCreationRemoveCheckpointAction, IProjectCreationUpdateCheckpointAction } from './../ActionCreators/projectCreationActionCreators';
import { ADD_CHECKPOINT, DELETE_CHECKPOINT, SET_PROJECT_NAME, UPDATE_CHECKPOINT } from './../Actions/projectCreationActions';

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
    case UPDATE_CHECKPOINT:
      const updateCheckpointAction = action as IProjectCreationUpdateCheckpointAction;
      const checkpointsWithUpdatedCheckpoint = state.checkpoints.map((checkpoint, index) => {
        if (index === updateCheckpointAction.index) {
          return updateCheckpointAction.checkpoint;
        } else {
          return checkpoint;
        }
      });
      return {
        ...state,
        checkpoints: checkpointsWithUpdatedCheckpoint,
      }
    default:
      return state;
  }
}