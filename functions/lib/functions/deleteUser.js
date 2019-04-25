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
exports.deleteUserLocal = (auth, passedInAdmin) => functions.https.onCall((deleteUserRequest, context) => __awaiter(this, void 0, void 0, function* () {
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const userQueryPromise = firestore.collection('users')
        .where('uid', '==', uid)
        .where('companyId', '==', deleteUserRequest.companyId)
        .get();
    const userWeAreTryingToDeletePromise = firestore.collection('users')
        .doc(deleteUserRequest.id)
        .get();
    const usersAcrossAllCompaniesPromise = firestore.collection('users')
        .where('uid', '==', deleteUserRequest.uidOfUserToDelete)
        .get();
    const [userQuerySnapshot, userWeAreTryingToDeleteSnapshot, usersAcrossAllCompaniesSnapshot,] = yield Promise.all([
        userQueryPromise,
        userWeAreTryingToDeletePromise,
        usersAcrossAllCompaniesPromise,
    ]);
    const isAdmin = userQuerySnapshot.docs[0].data().type === userTypes_1.UserType.Admin;
    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }
    if (!userWeAreTryingToDeleteSnapshot.exists) {
        throw new functions.https.HttpsError('invalid-argument', 'That user you are trying to delete does not exist');
    }
    if (userWeAreTryingToDeleteSnapshot.data().type === userTypes_1.UserType.Admin) {
        const adminUsersQuerySnapshot = yield firestore.collection('users')
            .where('companyId', '==', deleteUserRequest.companyId)
            .where('type', '==', userTypes_1.UserType.Admin)
            .limit(2)
            .get();
        if (adminUsersQuerySnapshot.size < 1) {
            throw new functions.https.HttpsError('invalid-argument', 'You cannot change the last Admin user.');
        }
    }
    const shouldDeleteAuthenticatedUser = usersAcrossAllCompaniesSnapshot.docs.every((userCompanySnapshot) => {
        const companyUserData = userCompanySnapshot.data();
        const { isActive, companyId, } = companyUserData;
        if (companyId === deleteUserRequest.companyId || !isActive) {
            return true;
        }
        return false;
    });
    if (shouldDeleteAuthenticatedUser) {
        yield auth.deleteUser(deleteUserRequest.uidOfUserToDelete);
    }
    yield firestore.collection('users').doc(deleteUserRequest.id).set({
        isActive: false,
    }, { merge: true });
}));
//# sourceMappingURL=deleteUser.js.map