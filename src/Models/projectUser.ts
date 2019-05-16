import { UserType } from './userTypes';

export interface IProjectCreationProjectUser {
    companyUserId: string;
    email: string;
    name: string;
    type: UserType;
    checkpoints: Set<string>;
    checkpointModifier: 'AllCheckpoints' | 'AllCheckpointsExcept' | 'SomeCheckpoints';
}