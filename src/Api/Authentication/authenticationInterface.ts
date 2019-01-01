export interface IAuthenticationMessage {
    message: string;
}

export interface IAuthenticationApi {
    signUp(companyName: string, fullName: string, username: string, password: string): Promise<IAuthenticationMessage>;
    login(username: string, password: string): Promise<boolean>;
    logout(): Promise<void>;
}