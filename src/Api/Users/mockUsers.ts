import * as _ from 'lodash';
import { IUser } from './../../Models/user';
import { IUsersApi } from './usersApiInterface';

export class MockUsersApi implements IUsersApi {
    constructor(users?: IUser[]) {
        if (window['users']) {
            return;
        }

        if (users) {
            window['users'] = users
        } else {
            window['users'] = [];
        }
    }

    public getUsers(companyName: string): IUser[] {
        return _.cloneDeep(window['users']);
    }

    public addUser(companyName: string, user: IUser): IUser {
        window['users'].push({
            ...user,
            id: Date.now(),
        });
        return user;
    }

    public deleteUser(companyName: string, userId: string): boolean {
        window['users'] = window['users'].filter((user: IUser) => user.id !== userId);
        return true;
    }

    public updateUser(companyName: string, user: IUser): IUser {
        window['users'] = window['users'].map((compareUser: IUser) => {
            if (compareUser.id !== user.id) {
                return compareUser;
            } else {
                return user;
            }
        });
        return user;
    }
}