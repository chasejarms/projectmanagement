import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Collections } from '../models/collections';

export const onCreateOrUpdateUserLocal = (passedInAdmin: admin.app.App) => functions.firestore
    .document(`${Collections.CompanyUser}/{companyUserId}`)
    .onWrite(async(documentSnapshot) => {
        // don't need to do any of the following logic on delete
        if (!documentSnapshot.after.exists) {
            return;
        }

        // for create and on update if the user's full name changed
        if (!documentSnapshot.before.exists || documentSnapshot.before.data().fullName !== documentSnapshot.after.data().fullName) {
            const existingUserData = documentSnapshot.after.data();
            const nameSearchValues = createNameSearchValues(existingUserData.fullName);
            await passedInAdmin.firestore().collection(Collections.CompanyUser).doc(documentSnapshot.before.id).set({
                ...existingUserData,
                nameSearchValues,
            }, { merge: true });
        }
    });

function createNameSearchValues(fullName: string) {
    const arr = fullName.toLowerCase().split('');
    const uniqueNameSearchValues = new Set([]);
    const nameSearchValues = [];

    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            const key = arr.slice(i, j).join('');
            console.log('The key is: ', key);
            if (!uniqueNameSearchValues.has(key)) {
                uniqueNameSearchValues.add(key);
            }
        }
    }

    uniqueNameSearchValues.forEach((key) => {
        nameSearchValues.push(key);
    })

    return nameSearchValues;
}