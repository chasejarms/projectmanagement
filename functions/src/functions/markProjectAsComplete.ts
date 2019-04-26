import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { IFunctionsCaseCheckpoint } from '../models/caseCheckpoint';

export const markProjectAsCompleteLocal = (passedInAdmin: admin.app.App) => functions.firestore.document('caseCheckpoints/{caseCheckpointId}').onWrite(async(change, context) => {
    const {
        before,
        after,
    } = change;

    if (!before.exists) {
        console.log('case did not exist before now, exiting');
        return Promise.resolve();
    }

    const checkpointIsNotMarkedAsComplete = !after.data().complete;

    if (checkpointIsNotMarkedAsComplete) {
        console.log('checkpoint is not marked as complete and therefore case is not complete');
        return Promise.resolve();
    }

    const project = await passedInAdmin.firestore().collection('cases').doc(after.data().caseId).get();
    const caseCheckpointIds = project.data().caseCheckpoints as string[];

    console.log('caseCheckpointIds: ', caseCheckpointIds);

    const caseCheckpointsPromises = caseCheckpointIds.map((id) => {
        return passedInAdmin.firestore().collection('caseCheckpoints').doc(id).get();
    });

    const caseCheckpointSnapshots = await Promise.all(caseCheckpointsPromises);
    const caseIsComplete = caseCheckpointSnapshots.every((caseCheckpointSnapshot) => {
        return (caseCheckpointSnapshot.data() as IFunctionsCaseCheckpoint).complete;
    });

    console.log('caseIsComplete: ', caseIsComplete);

    if (caseIsComplete) {
        console.log('case id to update: ', after.data().caseId);
        await passedInAdmin.firestore().collection('cases').doc(after.data().caseId).set({
            complete: true,
        }, { merge: true });
    }
});
