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
exports.onCreateOrUpdateUserLocal = (passedInAdmin) => functions.firestore
    .document('users/{uid}')
    .onWrite((documentSnapshot) => __awaiter(this, void 0, void 0, function* () {
    // don't need to do any of the following logic on delete
    if (!documentSnapshot.after.exists) {
        return;
    }
    // for create and on update if the user's full name changed
    if (!documentSnapshot.before.exists || documentSnapshot.before.data().fullName !== documentSnapshot.after.data().fullName) {
        const existingUserData = documentSnapshot.after.data();
        const nameSearchValues = createNameSearchValues(existingUserData.fullName);
        yield passedInAdmin.firestore().collection('users').doc(documentSnapshot.before.id).set(Object.assign({}, existingUserData, { nameSearchValues }), { merge: true });
    }
}));
function createNameSearchValues(fullName) {
    const arr = fullName.toLowerCase().split('');
    const nameSearchValues = [];
    let prevKey = '';
    for (const char of arr) {
        const key = prevKey + char;
        nameSearchValues.push(key);
        prevKey = key;
    }
    return nameSearchValues;
}
//# sourceMappingURL=onUserWrite.js.map