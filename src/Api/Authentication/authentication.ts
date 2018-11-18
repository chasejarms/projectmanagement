import firebase, { db } from '../../firebase';
import { IAuthenticationApi, IAuthenticationMessage } from './authenticationInterface';

export class AuthenticationApi implements IAuthenticationApi {
    public async signUp(
        companyName: string,
        fullName: string,
        email: string,
        password: string,
    ): Promise<IAuthenticationMessage> {
        const modifiedCompanyName = companyName.trim().toLowerCase();
        const signUp = firebase.functions().httpsCallable('signUp');
        try {
            await signUp({
                companyName: modifiedCompanyName,
                fullName,
                email,
                password,
            });
        }  catch (error) {
            // tslint:disable-next-line:no-console
            console.log(error);
            Promise.reject({
                wasSuccessful: false,
                message: 'Something went wrong with signup',
            })
        }

        try {
            await firebase.auth().signInWithEmailAndPassword(
                email,
                password,
            )
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(error);
            Promise.reject({
                wasSuccessful: false,
                message: 'Something went wrong with login',
            })
        }

        return Promise.resolve({
            wasSuccessful: true,
            message: 'Success',
        });
    }

    public async login(
        companyName: string,
        email: string,
        password: string,
    ): Promise<any> {
        const modifiedCompanyName = companyName.trim().toLowerCase();
        let response: any;
        try {
            response = await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch(error) {
            return Promise.reject(error.message);
        }

        const userInDatabaseResponse = await db.collection('companies').doc(modifiedCompanyName).collection('users').doc(response.user!.uid).get();

        if (userInDatabaseResponse.exists) {
            return Promise.resolve();
        } else {
            return Promise.reject('The user does not exist on that company');
        }
    }
}