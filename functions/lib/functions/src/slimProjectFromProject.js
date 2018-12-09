"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
exports.slimProjectFromProjectCreateLocal = (passedInAdmin) => functions.firestore.document('companies/{companyName}/cases/{caseId}').onCreate((document, context) => {
    const project = document.data();
    const currentCheckpoint = project.checkpoints.find((checkpoint) => !checkpoint.complete).name;
    const slimProject = {
        projectId: project.id,
        projectName: project.name,
        currentCheckpoint,
        deadline: project.deadline,
        showNewInfoFrom: null,
    };
    const companyName = context.params.companyName;
    passedInAdmin.firestore()
        .collection('companies')
        .doc(companyName)
        .collection('slimProjects')
        .doc(project.id)
        .set(slimProject);
});
exports.slimProjectFromProjectUpdateLocal = (passedInAdmin) => functions.firestore.document('companies/{companyName}/cases/{caseName}').onUpdate((change, context) => {
    const project = change.after.data();
    const currentCheckpoint = project.checkpoints.find((checkpoint) => !checkpoint.complete).name;
    const slimProject = {
        projectId: project.id,
        projectName: project.name,
        currentCheckpoint,
        deadline: project.deadline,
        showNewInfoFrom: null,
    };
    const companyName = context.params.companyName;
    passedInAdmin.firestore()
        .collection('companies')
        .doc(companyName)
        .collection('slimProjects')
        .doc(project.id)
        .set(slimProject);
});
exports.deleteSlimProjectLocal = (passedInAdmin) => functions.firestore.document('companies/{companyName}/cases/{caseName}').onDelete((document, context) => {
    const project = document.data();
    const companyName = context.params.companyName;
    passedInAdmin.firestore()
        .collection('companies')
        .doc(companyName)
        .collection('slimProjects')
        .doc(project.id)
        .delete();
});
//# sourceMappingURL=slimProjectFromProject.js.map