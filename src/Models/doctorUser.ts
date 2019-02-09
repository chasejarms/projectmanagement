import { IBaseUser } from './baseUser';
import { IUnitedStatesAddress } from './unitedStatesAddress';
import { UserType } from './userTypes';

export interface IDoctorUser extends IBaseUser {
    type: UserType.Doctor;
    address: IUnitedStatesAddress;
    telephone: string;
}