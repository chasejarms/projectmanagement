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
exports.getCasesLocal = (passedInAdmin) => functions.https.onCall(({ companyId, limit, startAfter, }, context) => __awaiter(this, void 0, void 0, function* () {
    const firestore = passedInAdmin.firestore();
    // check if the user is an admin or staff
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const companyUserJoinQuerySnapshot = yield firestore.collection('companyUserJoin')
        .where('companyId', '==', companyId)
        .where('firebaseAuthenticationUid', '==', uid)
        .get();
    if (companyUserJoinQuerySnapshot.empty) {
        return Promise.reject('That user does not exist');
    }
    const userId = companyUserJoinQuerySnapshot.docs[0].data().userId;
    const companyUserDocumentSnapshot = yield firestore.collection('users').doc(userId).get();
    if (!companyUserDocumentSnapshot.exists) {
        return Promise.reject('That user does not exist');
    }
    const userType = companyUserDocumentSnapshot.data().type;
    console.log('userType: ', userType);
    const isAdminOrStaff = userType === userTypes_1.UserType.Admin || userType === userTypes_1.UserType.Staff;
    console.log('isAdminOrStaff: ', isAdminOrStaff);
    let slimCases;
    if (isAdminOrStaff) {
        if (!!startAfter) {
            slimCases = yield firestore.collection('slimCases')
                .where('companyId', '==', companyId)
                .orderBy('deadline', 'asc')
                .limit(limit)
                .startAfter(startAfter)
                .get();
        }
        else {
            slimCases = yield firestore.collection('slimCases')
                .where('companyId', '==', companyId)
                .orderBy('deadline', 'asc')
                .limit(limit)
                .get();
        }
    }
    else {
        if (!!startAfter) {
            // only return the slimCases associated with that particular doctor
            slimCases = yield firestore.collection('slimCases')
                .where('companyId', '==', companyId)
                .where('doctor', '==', userId)
                .orderBy('deadline', 'asc')
                .limit(limit)
                .startAfter(startAfter)
                .get();
        }
        else {
            slimCases = yield firestore.collection('slimCases')
                .where('companyId', '==', companyId)
                .where('doctor', '==', userId)
                .orderBy('deadline', 'asc')
                .limit(limit)
                .get();
        }
    }
    const slimCasesList = [];
    slimCases.forEach((document) => {
        slimCasesList.push(Object.assign({}, document.data(), { id: document.id }));
    });
    console.log('slimCasesList: ', slimCasesList);
    return slimCasesList;
}));
//# sourceMappingURL=getCases.js.map