import { UserType } from './userTypes';

export interface IProjectCreationProjectUser {
    userId: string;
    email: string;
    name: string;
    type: UserType;
    checkpoints: Set<string>;
    checkpointModifier: 'AllCheckpoints' | 'AllCheckpointsExcept' | 'SomeCheckpoints';
}