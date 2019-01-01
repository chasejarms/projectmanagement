import { db } from '../../firebase';
import { IUser } from './../../Models/user';
import { IUsersApi } from './usersApiInterface';

export class UsersApi implements IUsersApi {
    public async getUsers(companyId: string): Promise<IUser[]> {
        const usersQuerySnapshot = await db.collection('users')
            .where('companyId', '==', companyId)
            .orderBy('fullName', 'asc')
            .get();

        return usersQuerySnapshot.docs.map((querySnapshot) => {
            const userData = querySnapshot.data() as IUser;
            return {
                ...userData,
                id: querySnapshot.id,
            }
        });
    }

    public async addUser(companyName: string, user: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }

    public deleteUser(companyName: string, userId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public updateUser(companyName: string, user: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
}