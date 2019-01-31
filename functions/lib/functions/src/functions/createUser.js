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
exports.createUserLocal = (auth, firestore) => functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const userQueryPromise = firestore.collection('users')
        .where('uid', '==', uid)
        .where('companyId', '==', data.companyId)
        .get();
    const userWeAreTryingToCreatePromise = firestore.collection('users')
        .where('email', '==', data.email)
        .where('companyId', '==', data.companyId)
        .get();
    const companyDocumentPromise = firestore.collection('companies')
        .doc(data.companyId)
        .get();
    const [userQuerySnapshot, userWeAreTryingToCreateSnapshot, companyDocumentSnapshot,] = yield Promise.all([
        userQueryPromise,
        userWeAreTryingToCreatePromise,
        companyDocumentPromise,
    ]);
    const isAdmin = userQuerySnapshot.docs[0].data().type === userTypes_1.UserType.Admin;
    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }
    if (!userWeAreTryingToCreateSnapshot.empty) {
        throw new functions.https.HttpsError('already-exists', 'That user already exists');
    }
    let userRecord;
    try {
        userRecord = yield auth.getUserByEmail(data.email);
    }
    catch (_a) {
        userRecord = yield auth.createUser({
            email: data.email,
            password: data.email,
        });
    }
    const userToCreate = {
        companyId: data.companyId,
        email: data.email,
        fullName: data.fullName,
        type: data.type,
        scanCheckpoints: data.scanCheckpoints || [],
        mustResetPassword: data.mustResetPassword,
        uid: userRecord.uid,
    };
    const createdUserDocumentSnapshot = yield firestore.collection('users').add(userToCreate);
    yield firestore.collection('companyUserJoin')
        .doc(`${data.companyId}_${userRecord.uid}`)
        .set({
        companyId: data.companyId,
        companyName: companyDocumentSnapshot.data().companyName,
        firebaseAuthenticationUid: userRecord.uid,
        userId: createdUserDocumentSnapshot.id,
    });
    return Object.assign({}, userToCreate, { id: createdUserDocumentSnapshot.id });
}));
//# sourceMappingURL=createUser.js.map