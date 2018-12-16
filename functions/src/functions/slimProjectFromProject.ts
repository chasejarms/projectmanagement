import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const slimProjectFromProjectCreateLocal = (passedInAdmin: admin.app.App) => functions.firestore.document('companies/{companyName}/cases/{caseId}').onCreate(
    (document: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {
        const project = document.data() as any; // as IProject
        console.log('project: ', project);
        const currentCheckpoint = project.checkpoints.find((checkpoint) => !checkpoint.complete).name;
        console.log('currentCheckpoint: ', currentCheckpoint);
        const slimProject: any = {
            projectName: project.name,
            currentCheckpoint,
            deadline: project.deadline,
            showNewInfoFrom: null,
        } as any; // ISlimProject

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
    },
);

export const slimProjectFromProjectUpdateLocal = (passedInAdmin: admin.app.App) => functions.firestore.document('companies/{companyName}/cases/{caseId}').onUpdate(
    (change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {
        const project = change.after.data() as any; // IProject
        const currentCheckpoint = project.checkpoints.find((checkpoint) => !checkpoint.complete).name;
        const slimProject: any = {
            projectId: project.id,
            projectName: project.name,
            currentCheckpoint,
            deadline: project.deadline,
            showNewInfoFrom: null,
        } as any; // ISlimProject

        const companyName = context.params.companyName;
        const caseId = context.params.caseId;
        return passedInAdmin.firestore()
            .collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .doc(caseId)
            .set(slimProject);
    },
);

export const deleteSlimProjectLocal = (passedInAdmin: admin.app.App) => functions.firestore.document('companies/{companyName}/cases/{caseId}').onDelete(
    (document: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {
        const project = document.data() as any; // IProject
        const companyName = context.params.companyName;
        const caseId = context.params.caseId;

        return passedInAdmin.firestore()
            .collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .doc(caseId)
            .delete();
    },
)