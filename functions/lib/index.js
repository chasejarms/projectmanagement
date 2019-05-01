"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canCreateCases_1 = require("./functions/canCreateCases");
const admin = require("firebase-admin");
const signUp_1 = require("./functions/signUp");
const createCase_1 = require("./functions/createCase");
const updateUser_1 = require("./functions/updateUser");
const deleteUser_1 = require("./functions/deleteUser");
const onUserWrite_1 = require("./functions/onUserWrite");
const linkFileToProject_1 = require("./functions/linkFileToProject");
const createThumbnailFromImage_1 = require("./functions/createThumbnailFromImage");
const createUser_1 = require("./functions/createUser");
const onCaseUpdate_1 = require("./functions/onCaseUpdate");
const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
});
const auth = app.auth();
const firestore = app.firestore();
exports.createUser = createUser_1.createUserLocal(auth, firestore);
exports.signUp = signUp_1.signUpLocal(app);
exports.createCase = createCase_1.createCaseLocal(app);
exports.updateUser = updateUser_1.updateUserLocal(app);
exports.deleteUser = deleteUser_1.deleteUserLocal(auth, app);
exports.onCreateOrUpdateUser = onUserWrite_1.onCreateOrUpdateUserLocal(app);
exports.linkFileToProject = linkFileToProject_1.linkFileToProjectLocal(app);
exports.createThumbnailFromImage = createThumbnailFromImage_1.createThumbnailFromImageLocal(app);
exports.canCreateCases = canCreateCases_1.canCreateCasesLocal(app);
exports.onCaseUpdate = onCaseUpdate_1.onCaseUpdateLocal(app);
//# sourceMappingURL=index.js.map