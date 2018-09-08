import { IUser } from '../../Models/user';

export interface IUsersApi {
    getUsers(): IUser[];
    addUser(user: IUser): IUser;
    deleteUser(userId: string): boolean;
    updateUser(user: IUser): IUser;
}