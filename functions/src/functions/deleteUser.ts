import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';

export interface IDeleteUserRequest {
    id: string;
    companyId: string
}

export const deleteUserLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(deleteUserRequest: IDeleteUserRequest, context) => {
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;
    console.log('uid is: ', uid);

    const userQueryPromise = firestore.collection('users')
        .where('uid', '==', uid)
        .where('companyId', '==', deleteUserRequest.companyId)
        .get();

    const userWeAreTryingToDeletePromise = firestore.collection('users')
        .doc(deleteUserRequest.id)
        .get()

    const companyDocumentPromise = firestore.collection('companies')
        .doc(deleteUserRequest.companyId)
        .get();

    const [
        userQuerySnapshot,
        userWeAreTryingToDeleteSnapshot,
    ] = await Promise.all([
        userQueryPromise,
        userWeAreTryingToDeletePromise,
        companyDocumentPromise,
    ])

    const isAdmin = userQuerySnapshot.docs[0].data().type === UserType.Admin;

    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }

    if (!userWeAreTryingToDeleteSnapshot.exists) {
        throw new functions.https.HttpsError('invalid-argument', 'That user you are trying to delete does not exist');
    }

    if (userWeAreTryingToDeleteSnapshot.data().type === UserType.Admin) {
        const adminUsersQuerySnapshot = await firestore.collection('users')
            .where('companyId', '==', deleteUserRequest.companyId)
            .where('type', '==', UserType.Admin)
            .limit(2)
            .get()

        if (adminUsersQuerySnapshot.size < 1) {
            throw new functions.https.HttpsError('invalid-argument', 'You cannot change the last Admin user.')
        }
    }

    await firestore.collection('users').doc(deleteUserRequest.id).delete();
})
