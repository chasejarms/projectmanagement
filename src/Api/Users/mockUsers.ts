import * as _ from 'lodash';
import { mockApiKey } from '../mockApi.key';
import { users as mockUsers } from './../../MockData/users';
import { IUser, IUserCreateRequest } from './../../Models/user';
import { IUsersApi } from './usersApiInterface';

export const companyUsersKey = `${mockApiKey}projectUsers`;

export class MockUsersApi implements IUsersApi {
    constructor(defaultCompanyUsers?: boolean) {
        this.getUsers('does not matter').then((users) => {
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
        });
    }

    public getUsers(companyName: string): Promise<IUser[]> {
        const stringifiedUsers = localStorage.getItem(companyUsersKey);
        const users = JSON.parse(stringifiedUsers!);
        const clonedUsers = _.cloneDeep(users);
        return Promise.resolve(clonedUsers);
    }

    public async addUser(user: IUserCreateRequest): Promise<IUser> {
        const users = await this.getUsers('does not matter');
        const addedUser = {
            ...user,
            id: Date.now().toString(),
        }
        const usersWithAddedUser = users.concat([addedUser as any]);
        localStorage.setItem(
            companyUsersKey,
            JSON.stringify(usersWithAddedUser),
        );
        return _.cloneDeep(addedUser as any);
    }

    public async deleteUser(companyName: string, userId: string): Promise<boolean> {
        const users = await this.getUsers('does not matter');
        const usersWithoutDeletedUsers = users.filter((user) => {
            return user.id !== userId;
        });
        localStorage.setItem(
            companyUsersKey,
            JSON.stringify(usersWithoutDeletedUsers),
        );
        return true;
    }

    public async updateUser(userToUpdate: IUser): Promise<IUser> {
        const users = await this.getUsers('does not matter');
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