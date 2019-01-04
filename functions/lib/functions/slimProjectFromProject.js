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
exports.slimCaseFromCaseChanges = (passedInAdmin) => functions.firestore.document('cases/{caseId}').onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    const { before, after, } = change;
    console.log('case before: ', before.data());
    console.log('case after: ', after.data());
    if (!after.exists) {
        return passedInAdmin.firestore().collection('slimCases').doc(context.params.caseId).delete();
    }
    const getCheckpointsPromises = (after.data().caseCheckpoints).map((caseCheckpointId) => {
        return passedInAdmin.firestore().collection('caseCheckpoints').doc(caseCheckpointId).get();
    });
    const checkpointDocumentSnapshots = yield Promise.all(getCheckpointsPromises);
    let currentCheckpointName = '';
    for (const checkpointDocumentSnapshot of checkpointDocumentSnapshots) {
        console.log('compare checkpoint: ', checkpointDocumentSnapshot.data());
        const checkpointIsComplete = checkpointDocumentSnapshot.data().complete;
        if (!checkpointIsComplete) {
            const currentWorkflowCheckpointDocument = yield passedInAdmin.firestore().collection('workflowCheckpoints').doc(checkpointDocumentSnapshot.data().linkedWorkflowCheckpoint).get();
            console.log('current workflow checkpoint: ', currentWorkflowCheckpointDocument.data());
            currentCheckpointName = currentWorkflowCheckpointDocument.data().name;
            break;
        }
    }
    const doctorDocumentReference = yield passedInAdmin.firestore().collection('users').doc(after.data().doctor).get();
    const doctorName = doctorDocumentReference.data().fullName;
    return yield passedInAdmin.firestore().collection('slimCases').doc(context.params.caseId).set({
        currentCheckpointName,
        caseId: after.id,
        name: after.data().name,
        deadline: after.data().deadline,
        doctor: after.data().doctor,
        doctorName,
        created: after.data().created,
        companyId: after.data().companyId,
        showNewInfoFrom: after.data().showNewInfoFrom,
    });
}));
//# sourceMappingURL=slimProjectFromProject.js.map