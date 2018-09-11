import { IUser } from '../../Models/user';

export interface IUsersApi {
    getUsers(companyName: string): IUser[];
    addUser(companyName: string, user: IUser): IUser;
    deleteUser(companyName: string, userId: string): boolean;
    updateUser(companyName: string, user: IUser): IUser;
}