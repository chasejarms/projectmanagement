import { Action } from 'redux';
import { ICheckpoint } from './../../Models/checkpoint';
import { ADD_CHECKPOINT, GET_INITIAL_CHECKPOINTS, SET_PROJECT_NAME } from './../Actions/projectCreationActions';

export interface IProjectCreationNameUpdateAction extends Action<typeof GET_INITIAL_CHECKPOINTS> {
    projectName: string;
}

export interface IProjectCreationAddCheckpointAction extends Action<typeof ADD_CHECKPOINT> {
    checkpoint: ICheckpoint;
}

export type IProjectCreationActions = IProjectCreationNameUpdateAction | IProjectCreationAddCheckpointAction;

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