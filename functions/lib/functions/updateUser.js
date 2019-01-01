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
exports.updateUserLocal = (passedInAdmin) => functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const userQueryPromise = firestore.collection('users')
        .where('uid', '==', uid)
        .where('companyId', '==', data.companyId)
        .get();
    const userWeAreTryingToUpdate = firestore.collection('users')
        .where('uid', '==', data.uid)
        .where('companyId', '==', data.companyId)
        .get();
    const [userQuerySnapshot, userWeAreTryingToUpdateSnapshot,] = yield Promise.all([
        userQueryPromise,
        userWeAreTryingToUpdate,
    ]);
    const isAdmin = userQuerySnapshot.docs[0].data().type === 'Admin';
    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }
    if (userWeAreTryingToUpdateSnapshot.empty) {
        throw new functions.https.HttpsError('invalid-argument', 'The user you are trying to update does not exist');
    }
    const userBeforeUpdate = userWeAreTryingToUpdateSnapshot.docs[0].data();
    const updatedUser = {};
    if (userBeforeUpdate.type === 'Admin' && data.type !== 'Admin') {
        const adminUsersQuerySnapshot = yield firestore.collection('users')
            .where('companyId', '==', data.companyId)
            .where('type', '==', 'Admin')
            .limit(2)
            .get();
        if (adminUsersQuerySnapshot.size < 1) {
            throw new functions.https.HttpsError('invalid-argument', 'You cannot change the last Admin user.');
        }
    }
    if (userBeforeUpdate.email !== data.email) {
        updatedUser['email'] = data.email;
    }
    if (userBeforeUpdate.fullName !== data.fullName) {
        updatedUser['fullName'] = data.fullName;
    }
    if (userBeforeUpdate.type !== data.type) {
        updatedUser['type'] = data.type;
    }
    if (userBeforeUpdate.scanCheckpoints.length !== data.scanCheckpoints.length) {
        updatedUser['scanCheckpoints'] = data.scanCheckpoints;
    }
    const dataScanCheckpoints = new Set(data.scanCheckpoints);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < userBeforeUpdate.scanCheckpoints.length; i++) {
        const currentScanCheckpoint = userBeforeUpdate.scanCheckpoints[i];
        if (!dataScanCheckpoints.has(currentScanCheckpoint)) {
            updatedUser['scanCheckpoints'] = data.scanCheckpoints;
            continue;
        }
    }
    if (Object.keys(updatedUser).length === 0) {
        return Object.assign({}, userWeAreTryingToUpdateSnapshot.docs[0].data(), { id: userWeAreTryingToUpdateSnapshot.docs[0].id });
    }
    else {
        yield firestore.collection('users')
            .doc(userWeAreTryingToUpdateSnapshot.docs[0].id)
            .set(updatedUser, {
            merge: true,
        });
        return Object.assign({}, userWeAreTryingToUpdateSnapshot.docs[0].data(), updatedUser);
    }
}));
//# sourceMappingURL=updateUser.js.map