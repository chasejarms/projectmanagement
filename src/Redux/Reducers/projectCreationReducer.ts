import { FormControlState } from 'src/Classes/formControlState';
import { ICheckpoint } from '../../Models/checkpoint';
import { IProjectCreationProjectUser } from './../../Models/projectUser';
import { requiredValidator } from './../../Validators/required.validator';
import { IProjectCreationActions, IProjectCreationAddCheckpointAction, IProjectCreationAddUserAction, IProjectCreationDeleteUserAction, IProjectCreationNameUpdateAction, IProjectCreationReceiveInitialCheckpointsAction, IProjectCreationRemoveCheckpointAction, IProjectCreationUpdateCheckpointAction, IProjectCreationUpdateUserAction } from './../ActionCreators/projectCreationActionCreators';
import { ADD_CHECKPOINT, ADD_PROJECT_USER, DELETE_CHECKPOINT, DELETE_PROJECT_USER, RECEIVE_INITIAL_CHECKPOINTS, RESET_PROJECT_CREATION, SET_PROJECT_NAME, UPDATE_CHECKPOINT, UPDATE_PROJECT_USER } from './../Actions/projectCreationActions';

export interface IProjectCreationSliceOfState {
    caseName: FormControlState<string>;
    checkpoints: ICheckpoint[];
    projectUsers: IProjectCreationProjectUser[];
}

const initialState = {
  caseName: new FormControlState({
    value: '',
    validators: [
      requiredValidator('The case name is required'),
    ]
  }).markAsInvalid(),
  checkpoints: [],
  projectUsers: [],
}

export const projectCreationReducer = (state: IProjectCreationSliceOfState = initialState, action: IProjectCreationActions): IProjectCreationSliceOfState => {
  switch (action.type) {
    case RESET_PROJECT_CREATION:
      return initialState;
    case SET_PROJECT_NAME:
      const projectNameAction = action as IProjectCreationNameUpdateAction;
      return {
        ...state,
        caseName: projectNameAction.caseName,
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
    case RECEIVE_INITIAL_CHECKPOINTS:
      const receiveInitialCheckpointsAction = action as IProjectCreationReceiveInitialCheckpointsAction;
      return {
        ...state,
        checkpoints: receiveInitialCheckpointsAction.checkpoints,
      }
    case ADD_PROJECT_USER:
      const addProjectUserAction = action as IProjectCreationAddUserAction;
      const projectUsers = state.projectUsers.concat(addProjectUserAction.projectUser);
      return {
        ...state,
        projectUsers,
      }
    case UPDATE_PROJECT_USER:
      const updateProjectUserAction = action as IProjectCreationUpdateUserAction;
      const updatedProjectUsers = state.projectUsers.map((projectUser, index) => {
        return index === updateProjectUserAction.index ? updateProjectUserAction.projectUser : projectUser;
      });
      return {
        ...state,
        projectUsers: updatedProjectUsers,
      }
    case DELETE_PROJECT_USER:
      const deleteProjectUserAction = action as IProjectCreationDeleteUserAction;
      const projectUsersMinusDeletedUser = state.projectUsers.filter((projectUser, index) => {
        return index !== deleteProjectUserAction.index;
      });
      return {
        ...state,
        projectUsers: projectUsersMinusDeletedUser,
      }
    default:
      return state;
  }
}