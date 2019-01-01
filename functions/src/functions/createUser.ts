import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface IUserCreateRequest {
    companyId: string;
    email: string;
    fullName: string;
    type: 'Admin' | 'Staff' | 'Customer';
    mustResetPassword: boolean;
    scanCheckpoints?: string[];
}

export const createUserLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data: IUserCreateRequest, context) => {
    const firestore = passedInAdmin.firestore();
    const auth = passedInAdmin.auth();
    const uid = context.auth.uid;
    console.log('uid is: ', uid);

    const userQueryPromise = firestore.collection('users')
        .where('uid', '==', uid)
        .where('companyId', '==', data.companyId)
        .get();

    const userWeAreTryingToCreatePromise = firestore.collection('users')
        .where('email', '==', data.email)
        .where('companyId', '==', data.companyId)
        .get();

    const companyDocumentPromise = firestore.collection('companies')
        .doc(data.companyId)
        .get();

    const [
        userQuerySnapshot,
        userWeAreTryingToCreateSnapshot,
        companyDocumentSnapshot,
    ] = await Promise.all([
        userQueryPromise,
        userWeAreTryingToCreatePromise,
        companyDocumentPromise,
    ])

    const isAdmin = userQuerySnapshot.docs[0].data().type === 'Admin';

    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }

    if (!userWeAreTryingToCreateSnapshot.empty) {
        throw new functions.https.HttpsError('already-exists', 'That user already exists');
    }

    let userRecord: admin.auth.UserRecord;

    try {
        userRecord = await auth.getUserByEmail(data.email);
    } catch {
        userRecord = await auth.createUser({
            email: data.email,
            password: data.email,
        });
    }

    const userToCreate = {
        companyId: data.companyId,
        email: data.email,
        fullName: data.fullName,
        type: data.type,
        scanCheckpoints: data.scanCheckpoints || [],
        mustResetPassword: data.mustResetPassword,
        uid: userRecord.uid,
    }

    const createdUserDocumentSnapshot = await firestore.collection('users').add(userToCreate);

    await firestore.collection('companyUserJoin').add({
        companyId: data.companyId,
        companyName: companyDocumentSnapshot.data().companyName,
        firebaseAuthenticationId: userRecord.uid,
        userId: createdUserDocumentSnapshot.id,
    })

    return {
        ...userToCreate,
        id: createdUserDocumentSnapshot.id,
    };
})
