import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export interface IProjectCreateData {
    name: string;
    deadline: string;
    notes: string;
    companyName: string;
}

export const createProjectLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data: IProjectCreateData, context) => {
    console.log(data.deadline);
    // check what type of user the requesting user is

    const project = {
        name: data.name,
        deadline: data.deadline,
        checkpoints: [],
        complete: false,
        doctor: '',
        notes: data.notes,
        attachments: [],
    };

    const userDocumentSnapshot = await passedInAdmin.firestore()
        .collection('companies')
        .doc(data.companyName)
        .collection('users')
        .doc(context.auth.uid)
        .get();

    if (!userDocumentSnapshot.exists) {
        throw new functions.https.HttpsError('permission-denied', 'The user does not exist on the company');
    }

    const userType = userDocumentSnapshot.data().type;

    if (userType === 'Admin' || userType === 'Staff') {
        project.doctor = 'The doctor did not create this';
    } else {
        project.doctor = 'The doctor did create this';
    }

    const companyDocumentSnapshot = await passedInAdmin.firestore()
        .collection('companies')
        .doc(data.companyName)
        .get();

    const workflowCheckpoints = companyDocumentSnapshot.data().workflow;

    const projectCheckpoints = workflowCheckpoints.map((workflowCheckpoint) => {
        return {
            name: workflowCheckpoint.name,
            estimatedCompletionTime: workflowCheckpoint.estimatedCompletionTime,
            visibleToDoctor: workflowCheckpoint.visibleToDoctor,
            complete: false,
            completedBy: null,
        };
    });

    project.checkpoints = projectCheckpoints;

    const projectDocumentReference = await passedInAdmin.firestore()
        .collection('companies')
        .doc(data.companyName)
        .collection('cases')
        .add(project);

    return projectDocumentReference.id;
});
