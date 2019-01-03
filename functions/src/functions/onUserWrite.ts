import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onCreateOrUpdateUserLocal = (passedInAdmin: admin.app.App) => functions.firestore
    .document('users/{uid}')
    .onWrite(async(documentSnapshot) => {
        // don't need to do any of the following logic on delete
        if (!documentSnapshot.after.exists) {
            return;
        }

        // for create and on update if the user's full name changed
        if (!documentSnapshot.before.exists || documentSnapshot.before.data().fullName !== documentSnapshot.after.data().fullName) {
            const existingUserData = documentSnapshot.after.data();
            const nameSearchValues = createNameSearchValues(existingUserData.fullName);
            await passedInAdmin.firestore().collection('users').doc(documentSnapshot.before.id).set({
                ...existingUserData,
                nameSearchValues,
            }, { merge: true });
        }
    });

function createNameSearchValues(fullName: string) {
    const arr = fullName.toLowerCase().split('');
    const nameSearchValues = [];

    let prevKey = '';

    for (const char of arr) {
        const key = prevKey + char;
        nameSearchValues.push(key);
        prevKey = key;
    }

    return nameSearchValues;
}