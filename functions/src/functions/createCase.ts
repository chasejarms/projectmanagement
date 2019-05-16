import { Collections } from '../models/collections';
import { ShowNewInfoFromType } from '../models/showNewInfoFromTypes';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
import { IFunctionsCaseCheckpoint } from '../models/caseCheckpoint';
import { IProjectCreateDataCloudFunctions } from '../models/projectCreateData';

interface ICase {
    complete: boolean;
    prescriptionTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
    created: admin.firestore.Timestamp;
    caseCheckpoints: IFunctionsCaseCheckpoint[];
    showNewInfoFrom: ShowNewInfoFromType.Doctor | ShowNewInfoFromType.Lab | null;
    hasStarted: boolean;
    doctorCompanyUserId: string;
    companyId: string;
    deadline: admin.firestore.Timestamp;
    currentDoctorCheckpointName: string;
    currentLabCheckpointName: string;
    doctorName: string;
    currentDoctorCheckpointId: string;
    currentLabCheckpointId: string;
}

export const createCaseLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data: IProjectCreateDataCloudFunctions, context) => {
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;

    const companyUserJoinQuerySnapshot = await firestore.collection(Collections.CompanyAuthUserJoin)
        .where('companyId', '==', data.companyId)
        .where('firebaseAuthenticationUid', '==', uid)
        .get();

    if (companyUserJoinQuerySnapshot.empty) {
        throw new functions.https.HttpsError('permission-denied', 'The user does not exist on the company');
    }

    const userId = companyUserJoinQuerySnapshot.docs[0].data().userId;

    const companyUserDocumentSnapshot = await firestore.collection(Collections.CompanyUser).doc(userId).get();

    if (!companyUserDocumentSnapshot.exists) {
        throw new functions.https.HttpsError('permission-denied', 'The user does not exist on the company');
    }

    const userIsActive = companyUserDocumentSnapshot.data().isActive;
    if (!userIsActive) {
        throw new functions.https.HttpsError('permission-denied', 'The user is not active on the company');
    }

    const userType = companyUserDocumentSnapshot.data().type;

    const isAdminOrStaff = userType === UserType.Admin || userType === UserType.Staff;

    const companyWorkflowsQuerySnapshot = await firestore.collection(Collections.CompanyWorkflow)
        .where('companyId', '==', data.companyId)
        .get();

    const workflowCheckpointIds: string[] = companyWorkflowsQuerySnapshot.docs[0].data().workflowCheckpoints;
    const workflowCheckpointPromises = workflowCheckpointIds.map((workflowCheckpointId) => {
        return firestore.collection(Collections.WorkflowCheckpoint).doc(workflowCheckpointId).get();
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

    const prescriptionTemplateResponse = await firestore.collection(Collections.PrescriptionTemplate).doc(prescriptionTemplateId).get();

    if (!prescriptionTemplateResponse.exists) {
        throw new functions.https.HttpsError('invalid-argument', 'The prescription template does not exist');
    }

    const prescriptionFormTemplate = prescriptionTemplateResponse.data();

    let doctorCompanyUserId: string;
    let caseDeadline: admin.firestore.Timestamp;

    prescriptionFormTemplate.sectionOrder.forEach((sectionId) => {
        const section = prescriptionFormTemplate.sections[sectionId];
        section.controlOrder.forEach((controlId) => {
            const control = prescriptionFormTemplate.controls[controlId];
            if (control.type === 'DoctorInformation') {
                doctorCompanyUserId = data.controlValues[control.id];
            } else if (control.type === 'CaseDeadline') {
                const caseDeadlineObject = data.controlValues[control.id];
                caseDeadline = new admin.firestore.Timestamp(caseDeadlineObject.seconds, caseDeadlineObject.nanoseconds);
            }
        })
    });

    if (!doctorCompanyUserId) {
        throw new functions.https.HttpsError('invalid-argument', 'The case requires a doctor information field');
    }

    if (!caseDeadline) {
        throw new functions.https.HttpsError('invalid-argument', 'The case requires a case deadline field');
    }

    const doctorSnapshot = await firestore.collection(Collections.CompanyUser).doc(doctorCompanyUserId).get();

    if (!doctorSnapshot.exists) {
        throw new functions.https.HttpsError('invalid-argument', 'The specified doctor does not exist on the company');
    }

    if (!doctorSnapshot.data().isActive) {
        throw new functions.https.HttpsError('invalid-argument', 'The specified doctor is not active on the company');
    }

    const doctorName = doctorSnapshot.data().fullName;

    const earliestDoctorCheckpoint = caseCheckpoints.find((caseCheckpoint) => {
        return caseCheckpoint.visibleToDoctor;
    });

    const firstCheckpoint = caseCheckpoints[0];

    const currentDoctorCheckpointId = earliestDoctorCheckpoint ? earliestDoctorCheckpoint.linkedWorkflowCheckpoint : '';
    const currentDoctorCheckpointName = earliestDoctorCheckpoint ? earliestDoctorCheckpoint.name : '';

    const currentLabCheckpointId = firstCheckpoint.linkedWorkflowCheckpoint;
    const currentLabCheckpointName = firstCheckpoint.name;

    const nowInSeconds = Math.round(new Date().getTime() / 1000);
    const caseToCreate: ICase = {
        prescriptionTemplateId: data.prescriptionTemplateId,
        controlValues: data.controlValues,
        complete: false,
        deadline: caseDeadline,
        doctorCompanyUserId: doctorCompanyUserId,
        created: new admin.firestore.Timestamp(nowInSeconds, 0),
        caseCheckpoints,
        companyId: data.companyId,
        showNewInfoFrom: isAdminOrStaff ? ShowNewInfoFromType.Lab : ShowNewInfoFromType.Doctor,
        hasStarted: false,
        currentDoctorCheckpointId,
        currentDoctorCheckpointName,
        currentLabCheckpointName,
        currentLabCheckpointId,
        doctorName,
    };

    await firestore.collection(Collections.Case).doc(data.id).set(caseToCreate);

    return data.id;
});
