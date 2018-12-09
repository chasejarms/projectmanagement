"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const signUp_1 = require("./signUp");
const getSlimProjects_1 = require("./getSlimProjects");
const createProject_1 = require("./createProject");
const slimProjectFromProject_1 = require("./slimProjectFromProject");
const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
});
exports.signUp = signUp_1.signUpLocal(app);
exports.getSlimProjects = getSlimProjects_1.getSlimProjectsLocal(app);
exports.createProject = createProject_1.createProjectLocal(app);
exports.slimProjectFromProjectCreate = slimProjectFromProject_1.slimProjectFromProjectCreateLocal(app);
exports.slimProjectFromProjectUpdate = slimProjectFromProject_1.slimProjectFromProjectUpdateLocal(app);
exports.deleteSlimProject = slimProjectFromProject_1.deleteSlimProjectLocal(app);
//# sourceMappingURL=index.js.map