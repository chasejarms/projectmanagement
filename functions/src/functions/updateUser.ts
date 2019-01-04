import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface IUser {
    id: string;
    uid: string;
    companyId: string;
    email: string;
    fullName: string;
    type: 'Admin' | 'Staff' | 'Customer';
    mustResetPassword: boolean;
    scanCheckpoints: string[];
}

export const updateUserLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data: IUser, context) => {
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;
    console.log('uid is: ', uid);

    const userQueryPromise = firestore.collection('users')
        .where('uid', '==', uid)
        .where('companyId', '==', data.companyId)
        .get();

    const userWeAreTryingToUpdate = firestore.collection('users')
        .where('uid', '==', data.uid)
        .where('companyId', '==', data.companyId)
        .get();

    const [
        userQuerySnapshot,
        userWeAreTryingToUpdateSnapshot,
    ] = await Promise.all([
        userQueryPromise,
        userWeAreTryingToUpdate,
    ])

    const isAdmin = userQuerySnapshot.docs[0].data().type === 'Admin';

    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }

    if (userWeAreTryingToUpdateSnapshot.empty) {
        throw new functions.https.HttpsError('invalid-argument', 'The user you are trying to update does not exist');
    }

    const userBeforeUpdate = userWeAreTryingToUpdateSnapshot.docs[0].data() as IUser;
    const updatedUser = {};

    if (userBeforeUpdate.type === 'Admin' && data.type !== 'Admin') {
        const adminUsersQuerySnapshot = await firestore.collection('users')
            .where('companyId', '==', data.companyId)
            .where('type', '==', 'Admin')
            .limit(2)
            .get()

        if (adminUsersQuerySnapshot.size < 1) {
            throw new functions.https.HttpsError('invalid-argument', 'You cannot change the last Admin user.')
        }
    }

    if (userBeforeUpdate.email !== data.email) {
        updatedUser['email'] = data.email;
    }

    if (userBeforeUpdate.fullName !== data.fullName) {
        updatedUser['fullName'] = data.fullName;
    }

    if (userBeforeUpdate.type !== data.type) {
        updatedUser['type'] = data.type;
    }

    if (userBeforeUpdate.scanCheckpoints.length !== data.scanCheckpoints.length) {
        updatedUser['scanCheckpoints'] = data.scanCheckpoints;
    }

    const dataScanCheckpoints = new Set(data.scanCheckpoints);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < userBeforeUpdate.scanCheckpoints.length; i++) {
        const currentScanCheckpoint = userBeforeUpdate.scanCheckpoints[i];
        if (!dataScanCheckpoints.has(currentScanCheckpoint)) {
            updatedUser['scanCheckpoints'] = data.scanCheckpoints;
            continue;
        }
    }

    if (Object.keys(updatedUser).length === 0) {
        return {
            ...userWeAreTryingToUpdateSnapshot.docs[0].data(),
            id: userWeAreTryingToUpdateSnapshot.docs[0].id,
        }
    } else {
        await firestore.collection('users')
            .doc(userWeAreTryingToUpdateSnapshot.docs[0].id)
            .set(updatedUser, {
                merge: true,
            })

        return {
            ...userWeAreTryingToUpdateSnapshot.docs[0].data(),
            ...updatedUser,
        }
    }
})