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
const prescriptionControlTemplateType_1 = require("../../../src/Models/prescription/controls/prescriptionControlTemplateType");
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
    const workflowCheckpoints = companyWorkflowsQuerySnapshot.docs[0].data().workflowCheckpoints;
    const checkpointCreationPromises = workflowCheckpoints.map((linkedWorkflowCheckpoint) => {
        const caseCheckpointToAdd = {
            complete: false,
            completedDate: null,
            completedBy: null,
            caseId: data.id,
            linkedWorkflowCheckpoint,
        };
        console.log('case checkpoint to add: ', caseCheckpointToAdd);
        return firestore.collection('caseCheckpoints').add(caseCheckpointToAdd);
    });
    const createdCheckpointDocumentReferences = yield Promise.all(checkpointCreationPromises);
    const createdCheckpointDocumentIds = createdCheckpointDocumentReferences.map((documentReference) => {
        return documentReference.id;
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
            if (control.type === prescriptionControlTemplateType_1.IPrescriptionControlTemplateType.DoctorInformation) {
                doctorId = data.controlValues[control.id];
            }
            else if (control.type === prescriptionControlTemplateType_1.IPrescriptionControlTemplateType.CaseDeadline) {
                // const caseDeadlineDate = data.controlValues[control.id];
                caseDeadline = new admin.firestore.Timestamp(new Date().getSeconds(), 0);
            }
        });
    });
    const nowInSeconds = Math.round(new Date().getTime() / 1000);
    console.log('nowInSeconds: ', nowInSeconds);
    const caseToCreate = {
        prescriptionFormTemplateId: data.prescriptionFormTemplateId,
        controlValues: data.controlValues,
        complete: false,
        deadline: caseDeadline,
        doctor: doctorId,
        created: new admin.firestore.Timestamp(nowInSeconds, 0),
        caseCheckpoints: createdCheckpointDocumentIds,
        companyId: data.companyId,
        showNewInfoFrom: isAdminOrStaff ? showNewInfoFromTypes_1.ShowNewInfoFromType.Lab : showNewInfoFromTypes_1.ShowNewInfoFromType.Doctor,
        hasStarted: false,
    };
    yield firestore.collection('cases').doc(data.id).set(caseToCreate);
    return data.id;
}));
//# sourceMappingURL=createCase.js.map