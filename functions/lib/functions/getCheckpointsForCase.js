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
exports.getCheckpointsLocal = (passedInAdmin) => functions.https.onCall(({ caseId, companyId, }, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('caseId: ', caseId);
    console.log('companyId: ', companyId);
    const firestore = passedInAdmin.firestore();
    // check if the user is an admin or staff
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const companyUserJoinQuerySnapshot = yield firestore.collection('companyUserJoin')
        .where('companyId', '==', companyId)
        .where('firebaseAuthenticationUid', '==', uid)
        .get();
    if (companyUserJoinQuerySnapshot.empty) {
        console.log('The company user join did not exist');
        return Promise.reject('That user does not exist');
    }
    const userId = companyUserJoinQuerySnapshot.docs[0].data().userId;
    const companyUserDocumentSnapshot = yield firestore.collection('users').doc(userId).get();
    if (!companyUserDocumentSnapshot.exists) {
        console.log('The user did not exist on the company');
        return Promise.reject('That user does not exist');
    }
    const userType = companyUserDocumentSnapshot.data().type;
    console.log('userType: ', userType);
    const isAdminOrStaff = userType === userTypes_1.UserType.Admin || userType === userTypes_1.UserType.Staff;
    console.log('isAdminOrStaff: ', isAdminOrStaff);
    const project = yield firestore.collection('cases').doc(caseId).get();
    const caseCheckpoints = project.data().caseCheckpoints;
    const getCaseCheckpointsPromises = caseCheckpoints.map((caseCheckpointId) => {
        return firestore.collection('caseCheckpoints').doc(caseCheckpointId).get();
    });
    const caseCheckpointDocumentSnapshots = yield Promise.all(getCaseCheckpointsPromises);
    const caseCheckpointDataWithId = caseCheckpointDocumentSnapshots.map((caseCheckpointDocumentSnapshot) => {
        return Object.assign({}, caseCheckpointDocumentSnapshot.data(), { id: caseCheckpointDocumentSnapshot.id });
    });
    console.log('caseCheckpointDataWithId: ', caseCheckpointDataWithId);
    const companyWorkflowCheckpointPromises = caseCheckpointDataWithId.map(({ linkedWorkflowCheckpoint }) => {
        return firestore.collection('workflowCheckpoints').doc(linkedWorkflowCheckpoint).get();
    });
    const companyWorkflowCheckpointSnapshots = yield Promise.all(companyWorkflowCheckpointPromises);
    const workflowCheckpointDataDictionary = companyWorkflowCheckpointSnapshots.reduce((acc, companyWorkflowCheckpointSnapshot) => {
        acc[companyWorkflowCheckpointSnapshot.id] = companyWorkflowCheckpointSnapshot.data();
        return acc;
    }, {});
    console.log('workflowCheckpointDataDictionary: ', workflowCheckpointDataDictionary);
    const unfilteredCheckpoints = caseCheckpointDataWithId.map((caseCheckpoint) => {
        const associatedWorkflowCheckpoint = workflowCheckpointDataDictionary[caseCheckpoint.linkedWorkflowCheckpoint];
        return Object.assign({}, caseCheckpoint, associatedWorkflowCheckpoint, { id: caseCheckpoint.id });
    });
    console.log('unfilteredCheckpoints: ', unfilteredCheckpoints);
    if (isAdminOrStaff) {
        return unfilteredCheckpoints;
    }
    else {
        const filteredCheckpoints = unfilteredCheckpoints.filter(({ visibleToDoctor }) => visibleToDoctor);
        console.log('filteredCheckpoints: ', filteredCheckpoints);
        return filteredCheckpoints;
    }
}));
//# sourceMappingURL=getCheckpointsForCase.js.map