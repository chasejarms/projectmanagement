import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const updateUserTypesCountOnUserWriteLocal = (passedInAdmin: admin.app.App) => functions.firestore
    .document('users/{uid}')
    .onWrite(async(documentSnapshot) => {
        const isCreate = !documentSnapshot.before.exists;
        const isDelete = !documentSnapshot.after.exists;

        if (isCreate) {
            const userRole = documentSnapshot.after.data().type;
            const companyId = documentSnapshot.after.data().companyId;

            const companySnapshot = await passedInAdmin.firestore().collection('companies').doc(companyId).get();

            const newRoleCount = companySnapshot.data().roleCount[userRole] + 1;

            await passedInAdmin.firestore().collection('companies').doc(companyId).set({
                roleCount: {
                    ...companySnapshot.data().roleCount,
                    [userRole]: newRoleCount,
                }
            });
        } else if (isDelete) {
            const userRole = documentSnapshot.before.data().type;
            const companyId = documentSnapshot.before.data().companyId;

            const companySnapshot = await passedInAdmin.firestore().collection('companies').doc(companyId).get();

            const newRoleCount = companySnapshot.data().roleCount[userRole] - 1;

            await passedInAdmin.firestore().collection('companies').doc(companyId).set({
                roleCount: {
                    ...companySnapshot.data().roleCount,
                    [userRole]: newRoleCount,
                }
            });
        } else if (documentSnapshot.after.data().type !== documentSnapshot.before.data().type) {
            const companyId = documentSnapshot.after.data().companyId;
            const newUserRole = documentSnapshot.after.data().type;
            const oldUserRole = documentSnapshot.before.data().type;

            const companySnapshot = await passedInAdmin.firestore().collection('companies').doc(companyId).get();

            const newRoleCount = companySnapshot.data().roleCount[newUserRole] + 1;
            const oldRoleCount = companySnapshot.data().roleCount[oldUserRole] + 1;

            await passedInAdmin.firestore().collection('companies').doc(companyId).set({
                roleCount: {
                    ...companySnapshot.data().roleCount,
                    [newUserRole]: newRoleCount,
                    [oldUserRole]: oldRoleCount,
                }
            });
        }
    });