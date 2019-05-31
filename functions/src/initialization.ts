import * as admin from 'firebase-admin';

export const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://shentaro-scan-only.firebaseio.com',
})
export const auth = app.auth();
export const firestore = app.firestore();