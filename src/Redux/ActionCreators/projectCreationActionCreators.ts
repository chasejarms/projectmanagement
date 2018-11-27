import { Action } from 'redux';
import { Dispatch } from 'redux';
import api from '../../Api/api';
import { ICheckpoint } from './../../Models/checkpoint';
import { IProjectCreationProjectUser } from './../../Models/projectUser';
import { ADD_CHECKPOINT, ADD_PROJECT_USER, DELETE_CHECKPOINT, DELETE_PROJECT_USER, GET_INITIAL_CHECKPOINTS, RECEIVE_INITIAL_CHECKPOINTS, SET_PROJECT_NAME, UPDATE_CHECKPOINT, UPDATE_PROJECT_USER } from './../Actions/projectCreationActions';

export interface IProjectCreationNameUpdateAction extends Action<typeof GET_INITIAL_CHECKPOINTS> {
    projectName: string;
}

export interface IProjectCreationAddCheckpointAction extends Action<typeof ADD_CHECKPOINT> {
    checkpoint: ICheckpoint;
}

export interface IProjectCreationRemoveCheckpointAction extends Action<typeof DELETE_CHECKPOINT> {
    index: number;
}

export interface IProjectCreationUpdateCheckpointAction extends Action<typeof UPDATE_CHECKPOINT> {
    index: number;
    checkpoint: ICheckpoint;
}

export interface IProjectCreationReceiveInitialCheckpointsAction extends Action<typeof RECEIVE_INITIAL_CHECKPOINTS> {
    checkpoints: ICheckpoint[];
}

export interface IProjectCreationAddUserAction extends Action<typeof ADD_PROJECT_USER> {
    projectUser: IProjectCreationProjectUser;
}

export interface IProjectCreationUpdateUserAction extends Action<typeof UPDATE_PROJECT_USER> {
    projectUser: IProjectCreationProjectUser;
    index: number;
}

export interface IProjectCreationDeleteUserAction extends Action<typeof DELETE_PROJECT_USER> {
    index: number;
}

export interface IProjectCreationGetCheckpointsAction extends Action<typeof GET_INITIAL_CHECKPOINTS> {}

export type IProjectCreationActions = IProjectCreationNameUpdateAction |
IProjectCreationAddCheckpointAction |
IProjectCreationRemoveCheckpointAction |
IProjectCreationReceiveInitialCheckpointsAction |
IProjectCreationAddUserAction |
IProjectCreationUpdateUserAction |
IProjectCreationDeleteUserAction;

export const setProjectNameCreator = (projectName: string): IProjectCreationNameUpdateAction => {
    return {
        type: SET_PROJECT_NAME,
        projectName,
    }
}

export const addCheckpointCreator = (checkpoint: ICheckpoint): IProjectCreationAddCheckpointAction => {
    return {
        type: ADD_CHECKPOINT,
        checkpoint,
    }
}

export const removeCheckpointCreation = (index: number): IProjectCreationRemoveCheckpointAction => {
    return {
        type: DELETE_CHECKPOINT,
        index,
    }
}

export const receiveInitialCheckpointsCreator = (initialCheckpoints: ICheckpoint[]): IProjectCreationReceiveInitialCheckpointsAction => {
    return {
        type: RECEIVE_INITIAL_CHECKPOINTS,
        checkpoints: initialCheckpoints,
    }
};

export const addProjectUserActionCreator = (projectUser: IProjectCreationProjectUser): IProjectCreationAddUserAction => {
    return {
        type: ADD_PROJECT_USER,
        projectUser,
    }
};

export const updateProjectUserActionCreator = (projectUser: IProjectCreationProjectUser, index: number): IProjectCreationUpdateUserAction => {
    return {
        type: UPDATE_PROJECT_USER,
        projectUser,
        index,
    }
}

export const deleteProjectUserActionCreator = (index: number): IProjectCreationDeleteUserAction => {
    return {
        type: DELETE_PROJECT_USER,
        index,
    }
}

export const getInitialCheckpoints = (companyName: string) => (dispatch: Dispatch) => {
    api.checkpointsApi.getCheckpointsForProjectCreation(companyName).then((initialCheckpoints) => {
        const receiveInitialCheckpointAction = receiveInitialCheckpointsCreator(initialCheckpoints);
        dispatch(receiveInitialCheckpointAction);
    });
}

export const updateCheckpointCreation = (index: number, checkpoint: ICheckpoint): IProjectCreationUpdateCheckpointAction => {
    return {
        type: UPDATE_CHECKPOINT,
        index,
        checkpoint,
    }
}