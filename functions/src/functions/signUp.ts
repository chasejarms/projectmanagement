import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const signUpLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data, context) => {
    const auth = passedInAdmin.auth();

    try {
        await auth.getUserByEmail(data.email);
    } catch {
        const firebase = passedInAdmin.firestore();

        const firebaseAuthenticationUser = await auth.createUser({
            email: data.email,
            password: data.password,
        })

        const createCompanyPromise = firebase.collection('companies').add({
            companyName: data.companyName,
        })


        const createUserPromise = firebase.collection('users').add({
            email: data.email,
            fullName: data.fullName,
            type: 'Admin',
            scanCheckpoints: [],
            mustResetPassword: false,
            uid: firebaseAuthenticationUser.uid,
        })

        const [
            companyDocumentReference,
            userDocumentReference,
        ] = await Promise.all([
            createCompanyPromise,
            createUserPromise,
        ]);

        await firebase.collection('companyUserJoin')
            .doc(`${companyDocumentReference.id}_${firebaseAuthenticationUser.uid}`)
            .set({
                companyId: companyDocumentReference.id,
                userId: userDocumentReference.id,
                firebaseAuthenticationUid: firebaseAuthenticationUser.uid,
                companyName: data.companyName,
            })

        return {
            user: firebaseAuthenticationUser,
        };
    }

    console.log(`${data.email} already exists in the system.`);
    throw new functions.https.HttpsError('already-exists', 'That user already exists');
});