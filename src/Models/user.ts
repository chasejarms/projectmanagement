import { UserType } from './userTypes';

export interface IUser extends IUserCreateRequest {
    id: string;
    uid: string;
}

export interface IUserCreateRequest {
    companyId: string;
    email: string;
    fullName: string;
    type: UserType;
    mustResetPassword: boolean;
    scanCheckpoints?: string[];
}