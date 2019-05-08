"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const signUp_1 = require("./functions/signUp");
const createCase_1 = require("./functions/createCase");
const updateUser_1 = require("./functions/updateUser");
const deleteUser_1 = require("./functions/deleteUser");
const onUserWrite_1 = require("./functions/onUserWrite");
const createThumbnailFromImage_1 = require("./functions/createThumbnailFromImage");
const createUser_1 = require("./functions/createUser");
const onCaseUpdate_1 = require("./functions/onCaseUpdate");
const updateUserTypesOnUserWrite_1 = require("./functions/updateUserTypesOnUserWrite");
const onChangePrescriptionTemplate_1 = require("./functions/onChangePrescriptionTemplate");
const onChangeCompanyWorkflow_1 = require("./functions/onChangeCompanyWorkflow");
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
exports.createThumbnailFromImage = createThumbnailFromImage_1.createThumbnailFromImageLocal(app);
exports.onCaseUpdate = onCaseUpdate_1.onCaseUpdateLocal(app);
exports.updateUserTypesCountOnUserWrite = updateUserTypesOnUserWrite_1.updateUserTypesCountOnUserWriteLocal(app);
exports.onChangePrescriptionTemplate = onChangePrescriptionTemplate_1.onChangePrescriptionTemplateLocal(app);
exports.onChangeCompanyWorkflow = onChangeCompanyWorkflow_1.onChangeCompanyWorkflowLocal(app);
//# sourceMappingURL=index.js.map