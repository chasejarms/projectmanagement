import { IBaseUser } from "./baseUser";
import { UserType } from "./userTypes";

export interface IStaffOrAdminUser extends IBaseUser {
    type: UserType.Staff | UserType.Admin;
    scanCheckpointIds: string[];
}