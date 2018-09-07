import { ICheckpoint } from './checkpoint';
import { IUser } from './user';

export interface IProject {
    id: string;
    name: string;
    checkpoints: ICheckpoint;
    complete: boolean;
    users: IUser[];
}