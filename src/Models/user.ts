import { IDoctorUser } from './doctorUser';
import { IStaffOrAdminUser } from './staffOrAdminUser';
import { UserType } from './userTypes';

export type IUser = IDoctorUser | IStaffOrAdminUser;

export interface IUserCreateRequest {
    companyId: string;
    email: string;
    fullName: string;
    type: UserType;
    mustResetPassword: boolean;
    scanCheckpoints?: string[];
}