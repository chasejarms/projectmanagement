import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
import { Collections } from '../models/collections';

export const signUpLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data, context) => {
    const auth = passedInAdmin.auth();

    try {
        await auth.getUserByEmail(data.email);
    } catch {
        const firebase = passedInAdmin.firestore();

        const authUser = await auth.createUser({
            email: data.email,
            password: data.password,
        })

        const companyDocumentReference = await firebase.collection(Collections.Company).add({
            companyName: data.companyName,
        })

        const userDocumentReference = await firebase.collection(Collections.CompanyUser).add({
            companyId: companyDocumentReference.id,
            email: data.email,
            name: data.name,
            type: UserType.Admin,
            authUserId: authUser.uid,
            isActive: true,
        });

        const createCompanyUserJoinPromise = firebase.collection(Collections.CompanyAuthUserJoin)
            .doc(`${companyDocumentReference.id}_${authUser.uid}`)
            .set({
                companyId: companyDocumentReference.id,
                companyUserId: userDocumentReference.id,
                authUserId: authUser.uid,
                companyName: data.companyName,
            })

        await Promise.all([
            createCompanyUserJoinPromise,
        ])

        return {
            user: authUser,
        };
    }

    console.log(`${data.email} already exists in the system.`);
    throw new functions.https.HttpsError('already-exists', 'That user already exists');
});