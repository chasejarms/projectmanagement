import * as admin from 'firebase-admin';

export const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
})
export const auth = app.auth();
export const firestore = app.firestore();