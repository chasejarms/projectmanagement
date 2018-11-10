import firebase, { db } from '../../firebase';
import { IAuthenticationApi } from './authenticationInterface';

export class AuthenticationApi implements IAuthenticationApi {
    public async signUp(
        companyName: string,
        fullName: string,
        email: string,
        password: string,
    ): Promise<boolean> {
        const modifiedCompanyName = companyName.trim().toLowerCase();
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        await db.collection('companies').doc(modifiedCompanyName).collection('users').add({
            fullName,
            email,
            type: 'Admin',
            scanCheckpoints: [],
        });
        return Promise.resolve(true);
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