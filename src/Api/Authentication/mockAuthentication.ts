import { companyUsersKey } from '../Users/mockUsers';
import { IAuthenticationApi } from './authenticationInterface';

export class MockAuthenticationApi implements IAuthenticationApi {
    public signUp(companyName: string, fullName: string, email: string, password: string): Promise<boolean> {
        const stringifiedUsers = localStorage.getItem(companyUsersKey);
        const users = JSON.parse(stringifiedUsers!);
        const usersWithSignedUpUser = users.concat([
            {
                id: Date.now().toString(),
                email,
                name: fullName,
                type: 'Admin',
                added: new Date(),
            }
        ]);
        const usersToSaveToStorage = JSON.stringify(usersWithSignedUpUser);
        localStorage.setItem(companyUsersKey, usersToSaveToStorage);
        return Promise.resolve(true);
    }

    public login(): Promise<boolean> {
        return Promise.resolve(true);
    }
}