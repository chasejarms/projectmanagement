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
const userTypes_1 = require("../models/userTypes");
exports.signUpLocal = (passedInAdmin) => functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    const auth = passedInAdmin.auth();
    try {
        yield auth.getUserByEmail(data.email);
    }
    catch (_a) {
        const firebase = passedInAdmin.firestore();
        const firebaseAuthenticationUser = yield auth.createUser({
            email: data.email,
            password: data.password,
        });
        const companyDocumentReference = yield firebase.collection('companies').add({
            companyName: data.companyName,
            roleCount: {
                Admin: 0,
                Staff: 0,
                Doctor: 0,
            }
        });
        const userDocumentReference = yield firebase.collection('users').add({
            companyId: companyDocumentReference.id,
            email: data.email,
            fullName: data.fullName,
            type: userTypes_1.UserType.Admin,
            scanCheckpoints: [],
            mustResetPassword: false,
            uid: firebaseAuthenticationUser.uid,
            isActive: true,
        });
        const prescriptionTemplateDocumentReference = yield firebase.collection('prescriptionTemplates').add({
            sectionOrder: [],
            sections: {},
            controls: {},
        });
        const createCompanyWorkflowPromise = firebase.collection('companyWorkflows').add({
            companyId: companyDocumentReference.id,
            workflowCheckpoints: [],
            prescriptionTemplate: prescriptionTemplateDocumentReference.id,
        });
        const createCompanyUserJoinPromise = firebase.collection('companyUserJoin')
            .doc(`${companyDocumentReference.id}_${firebaseAuthenticationUser.uid}`)
            .set({
            companyId: companyDocumentReference.id,
            userId: userDocumentReference.id,
            firebaseAuthenticationUid: firebaseAuthenticationUser.uid,
            companyName: data.companyName,
        });
        yield Promise.all([
            createCompanyWorkflowPromise,
            createCompanyUserJoinPromise,
        ]);
        return {
            user: firebaseAuthenticationUser,
        };
    }
    console.log(`${data.email} already exists in the system.`);
    throw new functions.https.HttpsError('already-exists', 'That user already exists');
}));
//# sourceMappingURL=signUp.js.map