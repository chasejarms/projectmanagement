"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const signUp_1 = require("./signUp");
const getSlimProjects_1 = require("./getSlimProjects");
const createProject_1 = require("./createProject");
const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
});
exports.signUp = signUp_1.signUpLocal(app);
exports.getSlimProjects = getSlimProjects_1.getSlimProjectsLocal(app);
exports.createProject = createProject_1.createProjectLocal(app);
//# sourceMappingURL=index.js.map