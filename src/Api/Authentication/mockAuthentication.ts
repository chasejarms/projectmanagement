import { companyUsersKey } from '../Users/mockUsers';
import { IAuthenticationApi, IAuthenticationMessage } from './authenticationInterface';

export class MockAuthenticationApi implements IAuthenticationApi {
    public signUp(companyName: string, fullName: string, email: string, password: string): Promise<IAuthenticationMessage> {
        const stringifiedUsers = localStorage.getItem(companyUsersKey);
        const users = JSON.parse(stringifiedUsers!);
        const usersWithSignedUpUser = users.concat([
            {
                id: Date.now().toString(),
                email,
                name: fullName,
                type: 'Admin',
            }
        ]);
        const usersToSaveToStorage = JSON.stringify(usersWithSignedUpUser);
        localStorage.setItem(companyUsersKey, usersToSaveToStorage);
        return Promise.resolve({
            wasSuccessful: true,
            message: 'Success',
        });
    }

    public login(): Promise<boolean> {
        return Promise.resolve(true);
    }
}