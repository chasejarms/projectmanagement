import { IAuthenticationApi } from './authenticationInterface';

export class AuthenticationApi implements IAuthenticationApi {
    public signUp(
        companyName: string,
        fullName: string,
        email: string,
        password: string,
    ): boolean {
        throw Error('method not implemented');
    }

    public login(
        email: string,
        password: string,
    ): boolean {
        throw Error('method not implemented');
    }
}