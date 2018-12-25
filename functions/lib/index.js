"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const signUp_1 = require("./functions/signUp");
const getSlimCases_1 = require("./functions/getSlimCases");
const createProject_1 = require("./functions/createProject");
const slimProjectFromProject_1 = require("./functions/slimProjectFromProject");
const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
});
exports.signUp = signUp_1.signUpLocal(app);
exports.getSlimCases = getSlimCases_1.getSlimCasesLocal(app);
exports.createProject = createProject_1.createProjectLocal(app);
exports.slimProjectFromProjectCreate = slimProjectFromProject_1.slimProjectFromProjectCreateLocal(app);
exports.slimProjectFromProjectUpdate = slimProjectFromProject_1.slimProjectFromProjectUpdateLocal(app);
exports.deleteSlimProject = slimProjectFromProject_1.deleteSlimProjectLocal(app);
//# sourceMappingURL=index.js.map