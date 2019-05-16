import * as firebase from 'firebase';

export interface IAuthenticationMessage {
    message: string;
}

export interface IAuthenticationApi {
    signUp(companyName: string, name: string, username: string, password: string): Promise<IAuthenticationMessage>;
    login(username: string, password: string): Promise<firebase.auth.UserCredential>;
    logout(): Promise<void>;
}