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
exports.updateUserLocal = (passedInAdmin) => functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('update user is being called');
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
    const isAdmin = userQuerySnapshot.docs[0].data().type === userTypes_1.UserType.Admin;
    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }
    if (userWeAreTryingToUpdateSnapshot.empty) {
        throw new functions.https.HttpsError('invalid-argument', 'The user you are trying to update does not exist');
    }
    const userBeforeUpdate = userWeAreTryingToUpdateSnapshot.docs[0].data();
    const isUpdatingSelf = context.auth.uid === userBeforeUpdate.uid;
    const updatedUser = {
        email: data.email,
        fullName: data.fullName,
        type: isUpdatingSelf ? userBeforeUpdate.type : data.type,
    };
    console.log('updatedUser before checking type: ', updatedUser);
    if (userBeforeUpdate.type === userTypes_1.UserType.Admin && data.type !== userTypes_1.UserType.Admin) {
        console.log('trying to change the last admin user');
        const adminUsersQuerySnapshot = yield firestore.collection('users')
            .where('companyId', '==', data.companyId)
            .where('type', '==', userTypes_1.UserType.Admin)
            .limit(2)
            .get();
        if (adminUsersQuerySnapshot.size < 1) {
            throw new functions.https.HttpsError('invalid-argument', 'You cannot change the last Admin user.');
        }
    }
    if (updatedUser.type === userTypes_1.UserType.Doctor) {
        updatedUser['address'] = data.address;
        updatedUser['telephone'] = data.telephone;
    }
    else {
        updatedUser['scanCheckpoints'] = data.scanCheckpoints;
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
        console.log('returned value: ', Object.assign({}, userWeAreTryingToUpdateSnapshot.docs[0].data(), updatedUser, { id: userWeAreTryingToUpdateSnapshot.docs[0].id }));
        return Object.assign({}, userWeAreTryingToUpdateSnapshot.docs[0].data(), updatedUser, { id: userWeAreTryingToUpdateSnapshot.docs[0].id });
    }
}));
//# sourceMappingURL=updateUser.js.map