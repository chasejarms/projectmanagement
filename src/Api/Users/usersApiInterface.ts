import { IUser, IUserCreateRequest } from '../../Models/user';

export interface IUsersApi {
    getUsers(companyName: string): Promise<IUser[]>;
    addUser(user: IUserCreateRequest): Promise<IUser>;
    deleteUser(companyName: string, userId: string): Promise<boolean>;
    updateUser(companyName: string, user: IUser): Promise<IUser>;
}