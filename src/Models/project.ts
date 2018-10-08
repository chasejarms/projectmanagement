import { ICheckpoint } from './checkpoint';
import { IProjectCreationProjectUser } from './projectUser';

export interface IProject {
    id: string;
    name: string;
    checkpoints: ICheckpoint[];
    complete: boolean;
    users: IProjectCreationProjectUser[];
}