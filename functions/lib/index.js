"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canCreateCases_1 = require("./functions/canCreateCases");
const markProjectAsStarted_1 = require("./functions/markProjectAsStarted");
const admin = require("firebase-admin");
const signUp_1 = require("./functions/signUp");
const getCases_1 = require("./functions/getCases");
const createCase_1 = require("./functions/createCase");
const updateUser_1 = require("./functions/updateUser");
const deleteUser_1 = require("./functions/deleteUser");
const onUserWrite_1 = require("./functions/onUserWrite");
const linkFileToProject_1 = require("./functions/linkFileToProject");
const createThumbnailFromImage_1 = require("./functions/createThumbnailFromImage");
const createUser_1 = require("./functions/createUser");
const markProjectAsComplete_1 = require("./functions/markProjectAsComplete");
const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
});
const auth = app.auth();
const firestore = app.firestore();
exports.createUser = createUser_1.createUserLocal(auth, firestore);
exports.signUp = signUp_1.signUpLocal(app);
exports.getCases = getCases_1.getCasesLocal(app);
exports.createCase = createCase_1.createCaseLocal(app);
exports.updateUser = updateUser_1.updateUserLocal(app);
exports.deleteUser = deleteUser_1.deleteUserLocal(auth, app);
exports.onCreateOrUpdateUser = onUserWrite_1.onCreateOrUpdateUserLocal(app);
exports.linkFileToProject = linkFileToProject_1.linkFileToProjectLocal(app);
exports.createThumbnailFromImage = createThumbnailFromImage_1.createThumbnailFromImageLocal(app);
exports.markProjectAsStarted = markProjectAsStarted_1.markProjectAsStartedLocal(app);
exports.canCreateCases = canCreateCases_1.canCreateCasesLocal(app);
exports.markProjectAsComplete = markProjectAsComplete_1.markProjectAsCompleteLocal(app);
//# sourceMappingURL=index.js.map