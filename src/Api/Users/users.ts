import { db } from '../../firebase';
import { IUser } from './../../Models/user';
import { IUsersApi } from './usersApiInterface';

export class UsersApi implements IUsersApi {
    public async getUsers(companyName: string): Promise<IUser[]> {
        const usersQuerySnapshot = await db.collection('companies').doc(companyName).collection('users').get();
        const users: any[] = [];
        usersQuerySnapshot.forEach((querySnapshot) => {
            const userData = querySnapshot.data();
            users.push({
                ...userData,
                id: querySnapshot.id,
            });
        });
    }

    public addUser(companyName: string, user: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }

    public deleteUser(companyName: string, userId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public updateUser(companyName: string, user: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
}