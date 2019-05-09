import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
import { Collections } from '../models/collections';
import { ICloudFunctionsDeleteUserRequest } from '../models/deleteUserRequest';

export const deleteUserLocal = (auth: admin.auth.Auth, passedInAdmin: admin.app.App) => functions.https.onCall(async(deleteUserRequest: ICloudFunctionsDeleteUserRequest, context) => {
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;

    const userQueryPromise = firestore.collection(Collections.CompanyUser)
        .where('uid', '==', uid)
        .where('companyId', '==', deleteUserRequest.companyId)
        .get();

    const userWeAreTryingToDeletePromise = firestore.collection(Collections.CompanyUser)
        .doc(deleteUserRequest.id)
        .get()

    const usersAcrossAllCompaniesPromise = firestore.collection(Collections.CompanyUser)
        .where('uid', '==', deleteUserRequest.uidOfUserToDelete)
        .get();

    const [
        userQuerySnapshot,
        userWeAreTryingToDeleteSnapshot,
        usersAcrossAllCompaniesSnapshot,
    ] = await Promise.all([
        userQueryPromise,
        userWeAreTryingToDeletePromise,
        usersAcrossAllCompaniesPromise,
    ])

    const userExists = userQuerySnapshot.docs.length > 0;

    if (!userExists) {
        throw new functions.https.HttpsError('permission-denied', 'The requesting user does not exist on this company');
    }

    const userIsActive = userQuerySnapshot.docs[0].data().isActive;

    if (!userIsActive) {
        throw new functions.https.HttpsError('permission-denied', 'The requesting user is not active on this company');
    }

    const isAdmin = userQuerySnapshot.docs[0].data().type === UserType.Admin;

    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'The requesting user is not an admin user');
    }

    if (!userWeAreTryingToDeleteSnapshot.exists) {
        throw new functions.https.HttpsError('invalid-argument', 'The user you are trying to delete does not exist');
    }

    const tryingToDeleteOwnUser = userWeAreTryingToDeleteSnapshot.data().uid === uid;
    if (tryingToDeleteOwnUser) {
        throw new functions.https.HttpsError('invalid-argument', 'You cannot delete your own user from the system');
    }

    const shouldDeleteAuthenticatedUser = usersAcrossAllCompaniesSnapshot.docs.every((userCompanySnapshot) => {
        const companyUserData = userCompanySnapshot.data();
        const {
            isActive,
            companyId,
        } = companyUserData;

        if (companyId === deleteUserRequest.companyId || !isActive) {
            return true;
        }

        return false;
    })

    if (shouldDeleteAuthenticatedUser) {
        await auth.deleteUser(deleteUserRequest.uidOfUserToDelete);
    }

    const companyAuthUserJoinToDeleteId = `${deleteUserRequest.companyId}_${deleteUserRequest.uidOfUserToDelete}`;
    const deleteCompanyAuthUserJoinPromise = firestore.collection(Collections.CompanyAuthUserJoin)
        .doc(companyAuthUserJoinToDeleteId)
        .delete();

    const setUserAsInactivePromise = firestore.collection(Collections.CompanyUser).doc(deleteUserRequest.id).set({
        isActive: false,
    }, { merge: true });

    await Promise.all([
        deleteCompanyAuthUserJoinPromise,
        setUserAsInactivePromise,
    ]);
})
