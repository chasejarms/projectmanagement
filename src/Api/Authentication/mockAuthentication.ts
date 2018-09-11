import { IAuthenticationApi } from './authenticationInterface';

export class MockAuthenticationApi implements IAuthenticationApi {
    public signUp(companyName: string, fullName: string, email: string, password: string): boolean {
        window['users'] = [{
            id: Date.now(),
            email,
            name: fullName,
            type: 'Admin',
            added: new Date(),
        }]
        return true;
    }
    
    public login(): boolean {
        return true;
    }
}