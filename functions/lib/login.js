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
exports.loginLocal = (passedInAdmin, firebaseAuth) => functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('sign up function');
    console.log('incoming data');
    console.log(data);
    const companyDocumentRef = yield passedInAdmin.firestore().collection('companies').doc(data.companyName).get();
    const companyExists = companyDocumentRef.exists;
    if (!companyExists) {
        const companyNotFoundErrorMessage = `${data.companyName} does not exist.`;
        console.log(companyNotFoundErrorMessage);
        throw new functions.https.HttpsError('not-found', companyNotFoundErrorMessage);
    }
    let user;
    const usernameOrPasswordError = 'The username or password is not correct.';
    try {
        console.log(`Trying to fetch a user with email: ${data.email}.`);
        user = yield passedInAdmin.auth().getUserByEmail(data.email);
    }
    catch (error) {
        console.log('The user does not exist in the firebase auth.');
        throw new functions.https.HttpsError('not-found', usernameOrPasswordError);
    }
    const companyUser = yield passedInAdmin.firestore().collection('companies').doc(data.companyName).collection('users').doc(user.uid).get();
    if (!companyUser.exists) {
        console.log('The username you provided does not exist for that company');
    }
    let userCredential;
    try {
        userCredential = yield firebaseAuth.signInWithEmailAndPassword(data.email, data.password);
    }
    catch (error) {
        console.log('The user password is not correct');
        throw new functions.https.HttpsError('not-found', usernameOrPasswordError);
    }
    return userCredential;
}));
//# sourceMappingURL=login.js.map