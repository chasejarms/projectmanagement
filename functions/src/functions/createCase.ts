// import { IPrescriptionFormTemplate } from '../../../src/Models/prescription/prescriptionFormTemplate';

import { ShowNewInfoFromType } from '../models/showNewInfoFromTypes';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
// import { IPrescriptionControlTemplateType } from '../../../src/Models/prescription/controls/prescriptionControlTemplateType';

// interface IAttachmentMetadata {
//     path: string;
//     contentType: string;
// }

interface IProjectCreateData {
    // name: string;
    // deadline: admin.firestore.Timestamp;
    // notes: string;
    // attachmentUrls: IAttachmentMetadata[];
    // doctor?: string;
    // companyId: string;
    // idForCase: string;
    id: string;
    prescriptionFormTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
    companyId: string;
}

interface ICase {
    complete: boolean;
    deadline: admin.firestore.Timestamp;
    doctor: string;
    // name: string;
    // notes: string;
    // attachmentUrls: IAttachmentMetadata[];
    created: admin.firestore.Timestamp;
    caseCheckpoints: string[];
    companyId: string;
    showNewInfoFrom: ShowNewInfoFromType.Doctor | ShowNewInfoFromType.Lab | null;
    hasStarted: boolean;
    // the stuff after this line has been added
    prescriptionFormTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
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
            caseId: data.id,
            linkedWorkflowCheckpoint,
        }
        console.log('case checkpoint to add: ', caseCheckpointToAdd);
        return firestore.collection('caseCheckpoints').add(caseCheckpointToAdd);
    });
    const createdCheckpointDocumentReferences = await Promise.all(checkpointCreationPromises);
    const createdCheckpointDocumentIds = createdCheckpointDocumentReferences.map((documentReference) => {
        return documentReference.id;
    });

    const prescriptionTemplateId = companyWorkflowsQuerySnapshot.docs[0].data().prescriptionTemplate;

    console.log('prescription template id: ', prescriptionTemplateId);

    const prescriptionTemplateResponse = await firestore.collection('prescriptionTemplates').doc(prescriptionTemplateId).get();

    const prescriptionFormTemplate = prescriptionTemplateResponse.data();

    let doctorId: string;
    let caseDeadline: admin.firestore.Timestamp;

    prescriptionFormTemplate.sectionOrder.forEach((sectionId) => {
        const section = prescriptionFormTemplate.sections[sectionId];
        section.controlOrder.forEach((controlId) => {
            const control = prescriptionFormTemplate.controls[controlId];
            if (control.type === 'DoctorInformation') {
                doctorId = data.controlValues[control.id];
            } else if (control.type === 'CaseDeadline') {
                const caseDeadlineObject = data.controlValues[control.id];
                caseDeadline = new admin.firestore.Timestamp(caseDeadlineObject.seconds, caseDeadlineObject.nanoseconds);
                console.log('caseDeadline: ', caseDeadline);
            }
        })
    });

    const nowInSeconds = Math.round(new Date().getTime() / 1000);
    console.log('nowInSeconds: ', nowInSeconds);
    const caseToCreate: ICase = {
        prescriptionFormTemplateId: data.prescriptionFormTemplateId,
        controlValues: data.controlValues,
        complete: false,
        deadline: caseDeadline,
        doctor: doctorId,
        created: new admin.firestore.Timestamp(nowInSeconds, 0),
        caseCheckpoints: createdCheckpointDocumentIds,
        companyId: data.companyId,
        showNewInfoFrom: isAdminOrStaff ? ShowNewInfoFromType.Lab : ShowNewInfoFromType.Doctor,
        hasStarted: false,
    };

    await firestore.collection('cases').doc(data.id).set(caseToCreate);

    return data.id;
});
