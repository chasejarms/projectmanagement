import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface ISlimCase {
    currentCheckpointName: string;
    caseId: string;
    name: string;
    deadline: string;
    doctor: string;
    doctorName: string;
    created: string;
    companyId: string;
    showNewInfoFrom: 'Doctor' | 'Lab' | null;
}

export const slimCaseFromCaseChanges = (passedInAdmin: admin.app.App) => functions.firestore.document('cases/{caseId}').onWrite(async(change, context) => {
    const {
        before,
        after,
    } = change;

    console.log('case before: ', before.data());
    console.log('case after: ', after.data());
    
    if (!after.exists) {
        return passedInAdmin.firestore().collection('slimCases').doc(context.params.caseId).delete();
    }

    const getCheckpointsPromises = ((after.data().caseCheckpoints) as string[]).map((caseCheckpointId) => {
        return passedInAdmin.firestore().collection('caseCheckpoints').doc(caseCheckpointId).get();
    })

    const checkpointDocumentSnapshots = await Promise.all(getCheckpointsPromises);
    let currentCheckpointName: string = '';
    for (const checkpointDocumentSnapshot of checkpointDocumentSnapshots) {
        console.log('compare checkpoint: ', checkpointDocumentSnapshot.data());
        const checkpointIsComplete = checkpointDocumentSnapshot.data().complete;
        if (!checkpointIsComplete) {

            const currentWorkflowCheckpointDocument = await passedInAdmin.firestore().collection('workflowCheckpoints').doc(
                checkpointDocumentSnapshot.data().linkedWorkflowCheckpoint
            ).get()

            console.log('current workflow checkpoint: ', currentWorkflowCheckpointDocument.data());


            currentCheckpointName = currentWorkflowCheckpointDocument.data().name;
            break;
        }
    }

    const doctorDocumentReference = await passedInAdmin.firestore().collection('users').doc(after.data().doctor).get();
    const doctorName = doctorDocumentReference.data().fullName;

    return await passedInAdmin.firestore().collection('slimCases').doc(context.params.caseId).set({
        currentCheckpointName,
        caseId: after.id,
        name: after.data().name,
        deadline: after.data().deadline,
        doctor: after.data().doctor,
        doctorName,
        created: after.data().created,
        companyId: after.data().companyId,
        showNewInfoFrom: after.data().showNewInfoFrom,
    } as ISlimCase)
});
