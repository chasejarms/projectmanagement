import * as _ from 'lodash';
import { mockApiKey } from '../mockApi.key';
import { users as mockUsers } from './../../MockData/users';
import { IUser } from './../../Models/user';
import { IUsersApi } from './usersApiInterface';

export const companyUsersKey = `${mockApiKey}projectUsers`;

export class MockUsersApi implements IUsersApi {
    constructor(defaultCompanyUsers?: boolean) {
        const users = this.getUsers('does not matter');
        const usersAlreadyExists = !!users && !!users.length;
        // tslint:disable-next-line:no-console
        console.log(usersAlreadyExists);
        if (defaultCompanyUsers && !usersAlreadyExists) {
            localStorage.setItem(
                companyUsersKey,
                JSON.stringify(mockUsers),
            )
        } else if (!usersAlreadyExists) {
            localStorage.setItem(
                companyUsersKey,
                JSON.stringify([]),
            )
        }
    }

    public getUsers(companyName: string): IUser[] {
        const stringifiedUsers = localStorage.getItem(companyUsersKey);
        const users = JSON.parse(stringifiedUsers!);
        return _.cloneDeep(users);
    }

    public addUser(companyName: string, user: IUser): IUser {
        const users = this.getUsers('does not matter');
        const addedUser = {
            ...user,
            id: Date.now().toString(),
        }
        const usersWithAddedUser = users.concat([addedUser]);
        localStorage.setItem(
            companyUsersKey,
            JSON.stringify(usersWithAddedUser),
        );
        return _.cloneDeep(addedUser);
    }

    public deleteUser(companyName: string, userId: string): boolean {
        const users = this.getUsers('does not matter');
        const usersWithoutDeletedUsers = users.filter((user) => {
            return user.id !== userId;
        });
        localStorage.setItem(
            companyUsersKey,
            JSON.stringify(usersWithoutDeletedUsers),
        );
        return true;
    }

    public updateUser(companyName: string, userToUpdate: IUser): IUser {
        const users = this.getUsers('does not matter');
        const usersWithUpdatedUser = users.map((user) => {
            if (userToUpdate.id !== user.id) {
                return user;
            } else {
                return userToUpdate;
            }
        });
        localStorage.setItem(
            companyUsersKey,
            JSON.stringify(usersWithUpdatedUser),
        )
        return userToUpdate;
    }
}