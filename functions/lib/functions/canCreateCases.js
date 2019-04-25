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
const functions = require("firebase-functions");
var UserType;
(function (UserType) {
    UserType["Doctor"] = "Doctor";
    UserType["Admin"] = "Admin";
    UserType["Staff"] = "Staff";
})(UserType || (UserType = {}));
exports.canCreateCasesLocal = (passedInAdmin) => functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    // is the prescription template in a good state?
    console.log('data: ', data);
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const companyWorkflowsPromise = firestore.collection('companyWorkflows')
        .where('companyId', '==', data.companyId)
        .get();
    const doctorUsersPromise = firestore.collection('users')
        .where('companyId', '==', data.companyId)
        .where('type', '==', UserType.Doctor)
        .where('isActive', '==', true)
        .limit(1)
        .get();
    const [companyWorkflowsQuerySnapshot, usersQuerySnapshot,] = yield Promise.all([
        companyWorkflowsPromise,
        doctorUsersPromise,
    ]);
    const hasSufficientWorkflowCheckpoints = companyWorkflowsQuerySnapshot.docs[0].data().workflowCheckpoints.length > 0;
    const hasSufficientDoctorUsers = usersQuerySnapshot.docs.length > 0;
    console.log('hasSufficientWorkflowCheckpoints: ', hasSufficientWorkflowCheckpoints);
    console.log('hasSufficientDoctorUsers: ', hasSufficientDoctorUsers);
    const prescriptionTemplateId = companyWorkflowsQuerySnapshot.docs[0].data().prescriptionTemplate;
    console.log('prescription template id: ', prescriptionTemplateId);
    const prescriptionTemplateResponse = yield firestore.collection('prescriptionTemplates').doc(prescriptionTemplateId).get();
    const prescriptionFormTemplate = prescriptionTemplateResponse.data();
    let doctorControlExists = false;
    let caseDeadlineExists = false;
    prescriptionFormTemplate.sectionOrder.forEach((sectionId) => {
        const section = prescriptionFormTemplate.sections[sectionId];
        section.controlOrder.forEach((controlId) => {
            const control = prescriptionFormTemplate.controls[controlId];
            if (control.type === 'DoctorInformation') {
                doctorControlExists = true;
            }
            else if (control.type === 'CaseDeadline') {
                caseDeadlineExists = true;
            }
        });
    });
    const prescriptionTemplateIsInGoodState = doctorControlExists && caseDeadlineExists;
    return hasSufficientWorkflowCheckpoints && hasSufficientDoctorUsers && prescriptionTemplateIsInGoodState;
}));
//# sourceMappingURL=canCreateCases.js.map