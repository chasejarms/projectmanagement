import * as firebase from 'firebase';
import { IDoctorUser } from 'src/Models/doctorUser';
import { IUserCreateRequest } from 'src/Models/requests/userCreateRequest';
import { UserType } from 'src/Models/userTypes';
import { db } from '../../firebase';
import { IUser } from './../../Models/user';
import { IDeleteUserRequest, IUsersApi } from './usersApiInterface';

export class UsersApi implements IUsersApi {
    public async getUsers(companyId: string): Promise<IUser[]> {
        const usersQuerySnapshot = await db.collection('users')
            .where('companyId', '==', companyId)
            .where('isActive', '==', true)
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

    public async searchDoctorUsers(companyId: string, searchString: string): Promise<IDoctorUser[]> {
        const updatedSearchString = searchString.toLowerCase();
        const userQuerySnapshot = await db.collection('users')
            .where('companyId', '==', companyId)
            .where('type', '==', UserType.Doctor)
            .where('nameSearchValues', 'array-contains', updatedSearchString)
            .where('isActive', '==', true)
            .orderBy('nameSearchValues', 'asc')
            .limit(5)
            .get();

        return userQuerySnapshot.docs.map((userDoc) => {
            return {
                ...userDoc.data() as IDoctorUser,
                id: userDoc.id,
            }
        });
    }

    public async getUser(userId: string): Promise<IUser> {
        const userDocumentSnapshot = await db.collection('users')
            .doc(userId)
            .get();

        return {
            ...userDocumentSnapshot.data() as IUser,
            id: userDocumentSnapshot.id,
        }
    }
}