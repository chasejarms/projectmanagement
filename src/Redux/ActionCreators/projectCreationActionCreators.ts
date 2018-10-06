import { Action } from 'redux';
import { ICheckpoint } from './../../Models/checkpoint';
import { ADD_CHECKPOINT, DELETE_CHECKPOINT, GET_INITIAL_CHECKPOINTS, SET_PROJECT_NAME, UPDATE_CHECKPOINT } from './../Actions/projectCreationActions';

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

export type IProjectCreationActions = IProjectCreationNameUpdateAction | IProjectCreationAddCheckpointAction | IProjectCreationRemoveCheckpointAction;

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

export const updateCheckpointCreation = (index: number, checkpoint: ICheckpoint): IProjectCreationUpdateCheckpointAction => {
    return {
        type: UPDATE_CHECKPOINT,
        index,
        checkpoint,
    }
}