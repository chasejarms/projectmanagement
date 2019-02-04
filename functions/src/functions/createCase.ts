import { ShowNewInfoFromType } from '../models/showNewInfoFromTypes';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';

interface IAttachmentMetadata {
    path: string;
    contentType: string;
}

interface IProjectCreateData {
    name: string;
    deadline: string;
    notes: string;
    attachmentUrls: IAttachmentMetadata[];
    doctor?: string;
    companyId: string;
    idForCase: string;
}

interface ICase {
    complete: boolean;
    deadline: string;
    doctor: string;
    name: string;
    notes: string;
    attachmentUrls: IAttachmentMetadata[];
    created: string;
    caseCheckpoints: string[];
    companyId: string;
    showNewInfoFrom: ShowNewInfoFromType.Doctor | ShowNewInfoFromType.Lab | null;
    hasStarted: boolean;
}

export const createCaseLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data: IProjectCreateData, context) => {
    console.log('data: ', data);
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

    const isAdminOrStaff = userType === UserType.Admin || userType === UserType.Staff;
    console.log('isAdminOrStaff: ', isAdminOrStaff);

    const companyWorkflowsQuerySnapshot = await firestore.collection('companyWorkflows')
        .where('companyId', '==', data.companyId)
        .get();

    const workflowCheckpoints: string[] = companyWorkflowsQuerySnapshot.docs[0].data().workflowCheckpoints;
    const checkpointCreationPromises = workflowCheckpoints.map((linkedWorkflowCheckpoint) => {
        const caseCheckpointToAdd = {
            complete: false,
            completedDate: null,
            completedBy: null,
            caseId: data.idForCase,
            linkedWorkflowCheckpoint,
        }
        console.log('case checkpoint to add: ', caseCheckpointToAdd);
        return firestore.collection('caseCheckpoints').add(caseCheckpointToAdd);
    });
    const createdCheckpointDocumentReferences = await Promise.all(checkpointCreationPromises);
    const createdCheckpointDocumentIds = createdCheckpointDocumentReferences.map((documentReference) => {
        return documentReference.id;
    });

    const doctor = isAdminOrStaff ? data.doctor : companyUserDocumentSnapshot.id;
    console.log('doctor: ', doctor);

    const caseToCreate: ICase = {
        complete: false,
        deadline: new Date(data.deadline).toUTCString(),
        doctor,
        name: data.name,
        notes: data.notes,
        attachmentUrls: data.attachmentUrls,
        created: new Date().toUTCString(),
        caseCheckpoints: createdCheckpointDocumentIds,
        companyId: data.companyId,
        showNewInfoFrom: isAdminOrStaff ? ShowNewInfoFromType.Doctor : ShowNewInfoFromType.Lab,
        hasStarted: false,
    };

    await firestore.collection('cases').doc(data.idForCase).set(caseToCreate);

    return data.idForCase;
});
