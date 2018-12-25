"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
exports.slimProjectFromProjectCreateLocal = (passedInAdmin) => functions.firestore.document('companies/{companyName}/cases/{caseId}').onCreate((document, context) => {
    const project = document.data(); // as IProject
    console.log('project: ', project);
    const currentCheckpoint = project.checkpoints.find((checkpoint) => !checkpoint.complete).name;
    console.log('currentCheckpoint: ', currentCheckpoint);
    const slimProject = {
        projectName: project.name,
        currentCheckpoint,
        deadline: project.deadline,
        showNewInfoFrom: null,
    }; // ISlimCase
    console.log('slimProject: ', slimProject);
    const companyName = context.params.companyName;
    console.log('companyName: ', companyName);
    const caseId = context.params.caseId;
    console.log('caseId: ', caseId);
    return passedInAdmin.firestore()
        .collection('companies')
        .doc(companyName)
        .collection('slimProjects')
        .doc(caseId)
        .set(slimProject);
});
exports.slimProjectFromProjectUpdateLocal = (passedInAdmin) => functions.firestore.document('companies/{companyName}/cases/{caseId}').onUpdate((change, context) => {
    const project = change.after.data(); // IProject
    const currentCheckpoint = project.checkpoints.find((checkpoint) => !checkpoint.complete).name;
    const slimProject = {
        projectId: project.id,
        projectName: project.name,
        currentCheckpoint,
        deadline: project.deadline,
        showNewInfoFrom: null,
    }; // ISlimCase
    const companyName = context.params.companyName;
    const caseId = context.params.caseId;
    return passedInAdmin.firestore()
        .collection('companies')
        .doc(companyName)
        .collection('slimProjects')
        .doc(caseId)
        .set(slimProject);
});
exports.deleteSlimProjectLocal = (passedInAdmin) => functions.firestore.document('companies/{companyName}/cases/{caseId}').onDelete((document, context) => {
    const project = document.data(); // IProject
    const companyName = context.params.companyName;
    const caseId = context.params.caseId;
    return passedInAdmin.firestore()
        .collection('companies')
        .doc(companyName)
        .collection('slimProjects')
        .doc(caseId)
        .delete();
});
//# sourceMappingURL=slimProjectFromProject.js.map