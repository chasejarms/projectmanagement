import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const markProjectAsStartedLocal = (passedInAdmin: admin.app.App) => functions.firestore.document('caseCheckpoints/{caseCheckpointId}').onWrite(async(change, context) => {
    const {
        before,
        after,
    } = change;

    if (!before.exists) {
        return Promise.resolve();
    }

    const project = await passedInAdmin.firestore().collection('cases').doc(after.data().caseId).get();
    if (project.data().hasStarted) {
        await passedInAdmin.firestore().collection('cases').doc(after.data().caseId).set({
            hasStarted: true,
        }, { merge: true });
    }
});
