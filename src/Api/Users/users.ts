import { IUser } from './../../Models/user';
import { IUsersApi } from './usersApiInterface';

export class UsersApi implements IUsersApi {
    public getUsers(companyName: string): IUser[] {
        throw new Error("Method not implemented.");
    }
    
    public addUser(companyName: string, user: IUser): IUser {
        throw new Error("Method not implemented.");
    }
    
    public deleteUser(companyName: string, userId: string): boolean {
        throw new Error("Method not implemented.");
    }
    
    public updateUser(companyName: string, user: IUser): IUser {
        throw new Error("Method not implemented.");
    }
}