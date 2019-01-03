import * as firebase from 'firebase';
import { db } from '../../firebase';
import { IUser, IUserCreateRequest } from './../../Models/user';
import { IDeleteUserRequest, IUsersApi } from './usersApiInterface';

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

    public async deleteUser(deleteUserRequest: IDeleteUserRequest): Promise<void> {
        const deleteUserCloudFunction = firebase.functions().httpsCallable('deleteUser');
        await deleteUserCloudFunction(deleteUserRequest);
    }

    public async updateUser(user: IUser): Promise<IUser> {
        const updateUserCloudFunction = firebase.functions().httpsCallable('updateUser');
        const updatedUser = await updateUserCloudFunction(user);
        return updatedUser.data;
    }

    public async searchDoctorUsers(companyId: string, searchString: string): Promise<IUser[]> {
        const updatedSearchString = searchString.toLowerCase();
        const userQuerySnapshot = await db.collection('users')
            .where('companyId', '==', companyId)
            .where('type', '==', 'Customer')
            .where('nameSearchValues', 'array-contains', updatedSearchString)
            .orderBy('nameSearchValues', 'asc')
            .limit(3)
            .get();

        return userQuerySnapshot.docs.map((userDoc) => {
            return {
                ...userDoc.data() as IUser,
                id: userDoc.id,
            }
        });
    }
}