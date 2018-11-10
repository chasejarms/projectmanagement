import { IUser } from '../../Models/user';

export interface IUsersApi {
    getUsers(companyName: string): Promise<IUser[]>;
    addUser(companyName: string, user: IUser): Promise<IUser>;
    deleteUser(companyName: string, userId: string): Promise<boolean>;
    updateUser(companyName: string, user: IUser): Promise<IUser>;
}