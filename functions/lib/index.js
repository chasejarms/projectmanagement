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
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
});
exports.signUp = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('incoming data');
    console.log(data);
    const companyDocumentRef = yield admin.firestore().collection('companies').doc(data.companyName).get();
    const companyAlreadyExists = companyDocumentRef.exists;
    console.log(`${data.companyName} already exists.`);
    if (companyAlreadyExists) {
        throw new functions.https.HttpsError('already-exists', 'The company you\'re trying to create already exists.');
    }
    // create the company
    yield admin.firestore().collection('companies').doc(data.companyName).set({
        companyName: data.companyName,
        caseNotesTemplate: '',
        workflow: [],
    });
    console.log(`${data.companyName} was created.`);
    let user;
    try {
        console.log(`Trying to fetch a user with email: ${data.email}.`);
        user = yield admin.auth().getUserByEmail(data.email);
    }
    catch (error) {
        console.log(`Trying to create a user with email: ${data.email}.`);
        user = yield admin.auth().createUser({
            email: data.email,
            password: data.password,
        });
    }
    yield admin.firestore()
        .collection('companies')
        .doc(data.companyName)
        .collection('users')
        .doc(user.uid)
        .set({
        fullName: data.fullName,
        email: data.email,
        type: 'Admin',
        scanCheckpoints: [],
    });
    return { user };
}));
exports.getSlimProjects = functions.https.onCall((companyName, context) => __awaiter(this, void 0, void 0, function* () {
    // check if the user is an admin or staff
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const userDocumentSnapshot = yield app.firestore().collection('companies')
        .doc(companyName)
        .collection('users')
        .doc(uid)
        .get();
    console.log('userDocumentSnapshot: ', userDocumentSnapshot);
    if (!userDocumentSnapshot.exists) {
        return Promise.reject('That user does not exist.');
    }
    const userType = userDocumentSnapshot.data().type;
    console.log('userType: ', userType);
    const isAdminOrStaff = userType === 'admin' || userType === 'staff';
    console.log('isAdminOrStaff: ', isAdminOrStaff);
    if (isAdminOrStaff) {
        return yield app.firestore().collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .get();
    }
    else {
        // change this to only return the project corresponding to that company
        return yield app.firestore().collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .get();
    }
}));
//# sourceMappingURL=index.js.map