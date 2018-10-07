import { ICheckpoint } from './checkpoint';
export interface IProjectCreationProjectUser {
    userId: string;
    email: string;
    name: string;
    type: 'Admin' | 'Staff' | 'Customer';
    checkpoints: IParticipatingCheckpoint;
}

export interface IParticipatingCheckpoint {
    [checkpointName: string]: ICheckpoint;
}