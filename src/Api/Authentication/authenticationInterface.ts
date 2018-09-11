export interface IAuthenticationApi {
    signUp(companyName: string, fullName: string, username: string, password: string): boolean;
    login(username: string, password: string): boolean;
}