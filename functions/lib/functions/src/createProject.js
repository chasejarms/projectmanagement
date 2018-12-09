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
exports.createProjectLocal = (passedInAdmin) => functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    // check what type of user the requesting user is
    const project = {
        name: data.name,
        deadline: data.deadline,
        checkpoints: [],
        complete: false,
        doctor: '',
        notes: data.notes,
        attachments: [],
    };
    const userDocumentSnapshot = yield passedInAdmin.firestore()
        .collection('companies')
        .doc(data.companyName)
        .collection('users')
        .doc(context.auth.uid)
        .get();
    if (!userDocumentSnapshot.exists) {
        throw new functions.https.HttpsError('permission-denied', 'The user does not exist on the company');
    }
    const userType = userDocumentSnapshot.data().type;
    if (userType === 'Admin' || userType === 'Staff') {
        project.doctor = 'The doctor did not create this';
    }
    else {
        project.doctor = 'The doctor did create this';
    }
    const companyDocumentSnapshot = yield passedInAdmin.firestore()
        .collection('companies')
        .doc(data.companyName)
        .get();
    const workflowCheckpoints = companyDocumentSnapshot.data().workflow;
    const projectCheckpoints = workflowCheckpoints.map((workflowCheckpoint) => {
        return {
            name: workflowCheckpoint.name,
            estimatedCompletionTime: workflowCheckpoint.estimatedCompletionTime,
            visibleToDoctor: workflowCheckpoint.visibleToDoctor,
            complete: false,
            completedBy: null,
        };
    });
    project.checkpoints = projectCheckpoints;
    const projectDocumentReference = yield passedInAdmin.firestore()
        .collection('companies')
        .doc(data.companyName)
        .collection('cases')
        .add(project);
    return projectDocumentReference;
}));
//# sourceMappingURL=createProject.js.map