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
    const workflowCheckpoints = companyWorkflowsQuerySnapshot.docs[0].data().workflowCheckpoints;
    const checkpointCreationPromises = workflowCheckpoints.map((linkedWorkflowCheckpoint) => {
        const caseCheckpointToAdd = {
            complete: false,
            completedDate: null,
            completedBy: null,
            caseId: data.idForCase,
            linkedWorkflowCheckpoint,
        };
        console.log('case checkpoint to add: ', caseCheckpointToAdd);
        return firestore.collection('caseCheckpoints').add(caseCheckpointToAdd);
    });
    const createdCheckpointDocumentReferences = yield Promise.all(checkpointCreationPromises);
    const createdCheckpointDocumentIds = createdCheckpointDocumentReferences.map((documentReference) => {
        return documentReference.id;
    });
    const doctor = isAdminOrStaff ? data.doctor : companyUserDocumentSnapshot.id;
    console.log('doctor: ', doctor);
    const nowInSeconds = Math.round(new Date().getTime() / 1000);
    console.log('nowInSeconds: ', nowInSeconds);
    const caseToCreate = {
        complete: false,
        deadline: data.deadline,
        doctor,
        name: data.name,
        notes: data.notes,
        attachmentUrls: data.attachmentUrls,
        created: new admin.firestore.Timestamp(nowInSeconds, 0),
        caseCheckpoints: createdCheckpointDocumentIds,
        companyId: data.companyId,
        showNewInfoFrom: isAdminOrStaff ? showNewInfoFromTypes_1.ShowNewInfoFromType.Lab : showNewInfoFromTypes_1.ShowNewInfoFromType.Doctor,
        hasStarted: false,
    };
    yield firestore.collection('cases').doc(data.idForCase).set(caseToCreate);
    return data.idForCase;
}));
//# sourceMappingURL=createCase.js.map