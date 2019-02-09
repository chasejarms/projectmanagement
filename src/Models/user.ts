import { IDoctorUser } from './doctorUser';
import { IStaffOrAdminUser } from './staffOrAdminUser';

export type IUser = IDoctorUser | IStaffOrAdminUser;