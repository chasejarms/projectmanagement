import { ICheckpoint } from './../../Models/checkpoint';
import { ICheckpointsApi } from './checkpointsInterface';

export class CheckpointsApi implements ICheckpointsApi {
    public getCheckpointsForProjectCreation(companyName: string): ICheckpoint[] {
        throw new Error("Method not implemented.");
    }
}