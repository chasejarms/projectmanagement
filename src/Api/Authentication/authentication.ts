import * as functions from 'firebase-functions';
import firebase from '../../firebase';
import { IAuthenticationApi, IAuthenticationMessage } from './authenticationInterface';

export class AuthenticationApi implements IAuthenticationApi {
    public async signUp(
        companyName: string,
        fullName: string,
        email: string,
        password: string,
    ): Promise<IAuthenticationMessage> {
        const signUp = firebase.functions().httpsCallable('signUp');
        try {
            await signUp({
                companyName,
                fullName,
                email,
                password,
            });
        }  catch (error) {
            const errorWithTyping = error as functions.https.HttpsError;

            return Promise.reject({
                message: errorWithTyping.message,
            })
        }

        try {
            await firebase.auth().signInWithEmailAndPassword(
                email,
                password,
            )
        } catch (error) {
            const errorWithTyping = error as functions.https.HttpsError;

            return Promise.reject({
                message: errorWithTyping.message,
            })
        }

        return Promise.resolve({
            message: 'Success',
        });
    }

    public async login(
        email: string,
        password: string,
    ): Promise<any> {
        return await firebase.auth().signInWithEmailAndPassword(email, password);
    }
}