import { IUser, IUserCreateRequest } from '../../Models/user';

export interface IDeleteUserRequest {
    companyId: string;
    id: string;
}

export interface IUsersApi {
    getUsers(companyName: string): Promise<IUser[]>;
    addUser(user: IUserCreateRequest): Promise<IUser>;
    deleteUser(deleteUserRequest: IDeleteUserRequest): Promise<void>;
    updateUser(user: IUser): Promise<IUser>;
}