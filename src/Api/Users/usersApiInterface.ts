import { IDoctorUser } from 'src/Models/doctorUser';
import { IUserCreateRequest } from 'src/Models/requests/userCreateRequest';
import { IUser } from '../../Models/user';

export interface IDeleteUserRequest {
    companyId: string;
    id: string;
    uidOfUserToDelete: string;
}

export interface IUsersApi {
    getUsers(companyId: string): Promise<IUser[]>;
    addUser(user: IUserCreateRequest): Promise<IUser>;
    deleteUser(deleteUserRequest: IDeleteUserRequest): Promise<void>;
    updateUser(user: IUser): Promise<IUser>;
    searchDoctorUsers(companyId: string, searchString: string): Promise<IDoctorUser[]>;
    getUser(userId: string): Promise<IUser>;
}