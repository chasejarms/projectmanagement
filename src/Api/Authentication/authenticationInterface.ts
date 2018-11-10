export interface IAuthenticationApi {
    signUp(companyName: string, fullName: string, username: string, password: string): Promise<boolean>;
    login(companyName: string, username: string, password: string): Promise<boolean>;
}