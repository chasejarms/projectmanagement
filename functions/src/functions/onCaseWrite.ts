import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Collections } from '../models/collections';

export const onCreateOrUpdateCaseLocal = (passedInAdmin: admin.app.App) => functions.firestore
    .document(`${Collections.Case}/{caseId}`)
    .onWrite(async(documentSnapshot) => {
        // don't need to do any of the following logic on delete
        if (!documentSnapshot.after.exists) {
            return;
        }

        // for create and on update if the user's full name changed
        if (!documentSnapshot.before.exists || documentSnapshot.before.data().patientName !== documentSnapshot.after.data().patientName) {
            const existingCaseData = documentSnapshot.after.data();
            const patientNameSearchValues = createNameSearchValues(existingCaseData.patientName);
            await passedInAdmin.firestore().collection(Collections.Case).doc(documentSnapshot.before.id).set({
                ...existingCaseData,
                patientNameSearchValues,
            }, { merge: true });
        }
    });

function createNameSearchValues(name: string) {
    const arr = name.toLowerCase().split('');
    const uniquePatientNameSearchValues = new Set([]);
    const patientNameSearchValues = [];

    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            const key = arr.slice(i, j + 1).join('');
            if (!uniquePatientNameSearchValues.has(key)) {
                uniquePatientNameSearchValues.add(key);
            }
        }
    }

    uniquePatientNameSearchValues.forEach((key) => {
        patientNameSearchValues.push(key);
    })

    return patientNameSearchValues;
}