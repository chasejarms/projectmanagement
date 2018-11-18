import * as admin from 'firebase-admin';
import { signUpLocal } from './signUp';

const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
})

export const signUp = signUpLocal(app);


