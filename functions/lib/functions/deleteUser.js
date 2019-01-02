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
exports.deleteUserLocal = (passedInAdmin) => functions.https.onCall((deleteUserRequest, context) => __awaiter(this, void 0, void 0, function* () {
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
    const companyDocumentPromise = firestore.collection('companies')
        .doc(deleteUserRequest.companyId)
        .get();
    const [userQuerySnapshot, userWeAreTryingToDeleteSnapshot, companyDocumentSnapshot,] = yield Promise.all([
        userQueryPromise,
        userWeAreTryingToDeletePromise,
        companyDocumentPromise,
    ]);
    const isAdmin = userQuerySnapshot.docs[0].data().type === 'Admin';
    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }
    if (!userWeAreTryingToDeleteSnapshot.exists) {
        throw new functions.https.HttpsError('invalid-argument', 'That user you are trying to delete does not exist');
    }
    if (userWeAreTryingToDeleteSnapshot.data().type === 'Admin') {
        const adminUsersQuerySnapshot = yield firestore.collection('users')
            .where('companyId', '==', deleteUserRequest.companyId)
            .where('type', '==', 'Admin')
            .limit(2)
            .get();
        if (adminUsersQuerySnapshot.size < 1) {
            throw new functions.https.HttpsError('invalid-argument', 'You cannot change the last Admin user.');
        }
    }
    yield firestore.collection('users').doc(deleteUserRequest.id).delete();
}));
//# sourceMappingURL=deleteUser.js.map