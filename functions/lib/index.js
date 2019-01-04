"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const signUp_1 = require("./functions/signUp");
const getCases_1 = require("./functions/getCases");
const createCase_1 = require("./functions/createCase");
const slimProjectFromProject_1 = require("./functions/slimProjectFromProject");
const createUser_1 = require("./functions/createUser");
const updateUser_1 = require("./functions/updateUser");
const deleteUser_1 = require("./functions/deleteUser");
const onUserWrite_1 = require("./functions/onUserWrite");
const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
});
exports.signUp = signUp_1.signUpLocal(app);
exports.getCases = getCases_1.getCasesLocal(app);
exports.createCase = createCase_1.createCaseLocal(app);
exports.slimCaseFromCase = slimProjectFromProject_1.slimCaseFromCaseChanges(app);
exports.createUser = createUser_1.createUserLocal(app);
exports.updateUser = updateUser_1.updateUserLocal(app);
exports.deleteUser = deleteUser_1.deleteUserLocal(app);
exports.onCreateOrUpdateUser = onUserWrite_1.onCreateOrUpdateUserLocal(app);
//# sourceMappingURL=index.js.map