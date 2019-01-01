import * as firebase from 'firebase';
import { db } from '../../firebase';
import { IUser, IUserCreateRequest } from './../../Models/user';
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

    public async addUser(userCreateRequest: IUserCreateRequest): Promise<IUser> {
        const createUserCloudFunction = firebase.functions().httpsCallable('createUser');
        const user = await createUserCloudFunction(userCreateRequest);
        return user.data;
    }

    public deleteUser(companyName: string, userId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public updateUser(companyName: string, user: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
}