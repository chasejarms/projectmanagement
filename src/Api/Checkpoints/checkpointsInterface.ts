import { ICheckpoint } from './../../Models/checkpoint';

export interface ICheckpointsApi {
    getCheckpointsForProjectCreation(companyName: string): Promise<ICheckpoint[]>;
}