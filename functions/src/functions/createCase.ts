import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface IProjectCreateData {
    name: string;
    deadline: string;
    notes: string;
    attachmentUrls: string[];
    companyId: string;
    doctor?: string;
}

interface ICase {
    complete: boolean;
    deadline: string;
    doctor: string;
    name: string;
    notes: string;
    attachmentUrls: string[];
    created: string;
    caseCheckpoints: string[];
}

export const createCaseLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data: IProjectCreateData, context) => {
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;
    console.log('uid is: ', uid);

    const companyUserJoinQuerySnapshot = await firestore.collection('companyUserJoin')
        .where('companyId', '==', data.companyId)
        .where('firebaseAuthenticationUid', '==', uid)
        .get();

    if (companyUserJoinQuerySnapshot.empty) {
        throw new functions.https.HttpsError('permission-denied', 'The user does not exist on the company');
    }

    const userId = companyUserJoinQuerySnapshot.docs[0].data().userId;

    const companyUserDocumentSnapshot = await firestore.collection('users').doc(userId).get();

    if (!companyUserDocumentSnapshot.exists) {
        throw new functions.https.HttpsError('permission-denied', 'The user does not exist on the company');
    }

    const userType = companyUserDocumentSnapshot.data().type;
    console.log('userType: ', userType);

    const isAdminOrStaff = userType === 'admin' || userType === 'staff';
    console.log('isAdminOrStaff: ', isAdminOrStaff);

    // get the doctor if the requesting user is not the doctor
    // also get the workflow
    // also create all of the checkpoint items
    const doctor = '1234';
    const caseCheckpoints = ['1234'];

    const caseToCreate: ICase = {
        complete: false,
        deadline: data.deadline,
        doctor,
        name: data.name,
        notes: data.notes,
        attachmentUrls: data.attachmentUrls,
        created: new Date().toUTCString(),
        caseCheckpoints,
    };

    const caseDocumentReference = await firestore.collection('cases').add(caseToCreate);

    return caseDocumentReference.id;
});
