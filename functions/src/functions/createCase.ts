// import { IPrescriptionFormTemplate } from '../../../src/Models/prescription/prescriptionFormTemplate';

import { ShowNewInfoFromType } from '../models/showNewInfoFromTypes';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
import { IFunctionsCaseCheckpoint } from '../models/caseCheckpoint';
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
    prescriptionFormTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
    created: admin.firestore.Timestamp;
    caseCheckpoints: IFunctionsCaseCheckpoint[];
    showNewInfoFrom: ShowNewInfoFromType.Doctor | ShowNewInfoFromType.Lab | null;
    hasStarted: boolean;
    doctor: string;
    companyId: string;
    deadline: admin.firestore.Timestamp;
    currentDoctorCheckpointName: string;
    currentLabCheckpointName: string;
    doctorName: string;
    currentDoctorCheckpoint: string;
    currentLabCheckpoint: string;
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

    const workflowCheckpointIds: string[] = companyWorkflowsQuerySnapshot.docs[0].data().workflowCheckpoints;
    const workflowCheckpointPromises = workflowCheckpointIds.map((workflowCheckpointId) => {
        return firestore.collection('workflowCheckpoints').doc(workflowCheckpointId).get();
    });

    const workflowCheckpointsSnapshots = await Promise.all(workflowCheckpointPromises);
    const caseCheckpoints: IFunctionsCaseCheckpoint[] = workflowCheckpointsSnapshots.map((workflowCheckpointSnapshot) => {
        const workflowCheckpoint = workflowCheckpointSnapshot.data();

        return {
            ...workflowCheckpoint as any,
            complete: false,
            completedDate: null,
            completedBy: null,
            completedByName: null,
            caseId: data.id,
            linkedWorkflowCheckpoint: workflowCheckpointSnapshot.id,
        }
    })

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

    const doctorSnapshot = await firestore.collection('users').doc(doctorId).get();
    const doctorName = doctorSnapshot.data().fullName;

    const earliestDoctorCheckpoint = caseCheckpoints.find((caseCheckpoint) => {
        return caseCheckpoint.visibleToDoctor;
    });

    const firstCheckpoint = caseCheckpoints[0];

    const currentDoctorCheckpoint = earliestDoctorCheckpoint ? earliestDoctorCheckpoint.linkedWorkflowCheckpoint : '';
    const currentDoctorCheckpointName = earliestDoctorCheckpoint ? earliestDoctorCheckpoint.name : '';

    const currentLabCheckpointName = firstCheckpoint.name;
    const currentLabCheckpoint = firstCheckpoint.linkedWorkflowCheckpoint;

    const nowInSeconds = Math.round(new Date().getTime() / 1000);
    console.log('nowInSeconds: ', nowInSeconds);
    const caseToCreate: ICase = {
        prescriptionFormTemplateId: data.prescriptionFormTemplateId,
        controlValues: data.controlValues,
        complete: false,
        deadline: caseDeadline,
        doctor: doctorId,
        created: new admin.firestore.Timestamp(nowInSeconds, 0),
        caseCheckpoints,
        companyId: data.companyId,
        showNewInfoFrom: isAdminOrStaff ? ShowNewInfoFromType.Lab : ShowNewInfoFromType.Doctor,
        hasStarted: false,
        currentDoctorCheckpoint,
        currentDoctorCheckpointName,
        currentLabCheckpointName,
        currentLabCheckpoint,
        doctorName,
    };

    await firestore.collection('cases').doc(data.id).set(caseToCreate);

    return data.id;
});
