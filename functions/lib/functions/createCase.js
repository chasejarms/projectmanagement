"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const showNewInfoFromTypes_1 = require("../models/showNewInfoFromTypes");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const userTypes_1 = require("../models/userTypes");
exports.createCaseLocal = (passedInAdmin) => functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('data: ', data);
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const companyUserJoinQuerySnapshot = yield firestore.collection('companyUserJoin')
        .where('companyId', '==', data.companyId)
        .where('firebaseAuthenticationUid', '==', uid)
        .get();
    if (companyUserJoinQuerySnapshot.empty) {
        throw new functions.https.HttpsError('permission-denied', 'The user does not exist on the company');
    }
    const userId = companyUserJoinQuerySnapshot.docs[0].data().userId;
    const companyUserDocumentSnapshot = yield firestore.collection('users').doc(userId).get();
    if (!companyUserDocumentSnapshot.exists) {
        throw new functions.https.HttpsError('permission-denied', 'The user does not exist on the company');
    }
    const userType = companyUserDocumentSnapshot.data().type;
    console.log('userType: ', userType);
    const isAdminOrStaff = userType === userTypes_1.UserType.Admin || userType === userTypes_1.UserType.Staff;
    console.log('isAdminOrStaff: ', isAdminOrStaff);
    const companyWorkflowsQuerySnapshot = yield firestore.collection('companyWorkflows')
        .where('companyId', '==', data.companyId)
        .get();
    const workflowCheckpointIds = companyWorkflowsQuerySnapshot.docs[0].data().workflowCheckpoints;
    const workflowCheckpointPromises = workflowCheckpointIds.map((workflowCheckpointId) => {
        return firestore.collection('workflowCheckpoints').doc(workflowCheckpointId).get();
    });
    const workflowCheckpointsSnapshots = yield Promise.all(workflowCheckpointPromises);
    const caseCheckpoints = workflowCheckpointsSnapshots.map((workflowCheckpointSnapshot) => {
        const workflowCheckpoint = workflowCheckpointSnapshot.data();
        return Object.assign({}, workflowCheckpoint, { complete: false, completedDate: null, completedBy: null, completedByName: null, caseId: data.id, linkedWorkflowCheckpoint: workflowCheckpointSnapshot.id });
    });
    const prescriptionTemplateId = companyWorkflowsQuerySnapshot.docs[0].data().prescriptionTemplate;
    console.log('prescription template id: ', prescriptionTemplateId);
    const prescriptionTemplateResponse = yield firestore.collection('prescriptionTemplates').doc(prescriptionTemplateId).get();
    const prescriptionFormTemplate = prescriptionTemplateResponse.data();
    let doctorId;
    let caseDeadline;
    prescriptionFormTemplate.sectionOrder.forEach((sectionId) => {
        const section = prescriptionFormTemplate.sections[sectionId];
        section.controlOrder.forEach((controlId) => {
            const control = prescriptionFormTemplate.controls[controlId];
            if (control.type === 'DoctorInformation') {
                doctorId = data.controlValues[control.id];
            }
            else if (control.type === 'CaseDeadline') {
                const caseDeadlineObject = data.controlValues[control.id];
                caseDeadline = new admin.firestore.Timestamp(caseDeadlineObject.seconds, caseDeadlineObject.nanoseconds);
                console.log('caseDeadline: ', caseDeadline);
            }
        });
    });
    const doctorSnapshot = yield firestore.collection('users').doc(doctorId).get();
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
    const caseToCreate = {
        prescriptionFormTemplateId: data.prescriptionFormTemplateId,
        controlValues: data.controlValues,
        complete: false,
        deadline: caseDeadline,
        doctor: doctorId,
        created: new admin.firestore.Timestamp(nowInSeconds, 0),
        caseCheckpoints,
        companyId: data.companyId,
        showNewInfoFrom: isAdminOrStaff ? showNewInfoFromTypes_1.ShowNewInfoFromType.Lab : showNewInfoFromTypes_1.ShowNewInfoFromType.Doctor,
        hasStarted: false,
        currentDoctorCheckpoint,
        currentDoctorCheckpointName,
        currentLabCheckpointName,
        currentLabCheckpoint,
        doctorName,
    };
    yield firestore.collection('cases').doc(data.id).set(caseToCreate);
    return data.id;
}));
//# sourceMappingURL=createCase.js.map