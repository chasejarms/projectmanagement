import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Collections } from '../models/collections';

export const updateUserTypesCountOnUserWriteLocal = (passedInAdmin: admin.app.App) => functions.firestore
    .document(`${Collections.CompanyUser}/{companyUserId}`)
    .onWrite(async(documentSnapshot) => {
        const beforeData = documentSnapshot.before.data();
        const afterData = documentSnapshot.after.data();

        const isCreate = !documentSnapshot.before.exists || (beforeData && !beforeData.isActive && afterData.isActive);
        const isDelete = !isCreate && beforeData.isActive && !afterData.isActive;

        console.log('isCreate: ', isCreate);
        console.log('isDelete: ', isDelete);

        if (isCreate) {
            const userRole = afterData.type;
            const companyId = afterData.companyId;

            const companySnapshot = await passedInAdmin.firestore().collection(Collections.Company).doc(companyId).get();

            const newRoleCount = companySnapshot.data().roleCount[userRole] + 1;

            console.log('userRole: ', userRole);
            console.log('newroleCount: ', newRoleCount);

            await passedInAdmin.firestore().collection(Collections.Company).doc(companyId).set({
                roleCount: {
                    ...companySnapshot.data().roleCount,
                    [userRole]: newRoleCount,
                }
            }, { merge: true });
        } else if (isDelete) {
            const userRole = beforeData.type;
            const companyId = beforeData.companyId;

            const companySnapshot = await passedInAdmin.firestore().collection(Collections.Company).doc(companyId).get();

            const newRoleCount = companySnapshot.data().roleCount[userRole] - 1;

            console.log('userRole: ', userRole);
            console.log('newroleCount: ', newRoleCount);

            await passedInAdmin.firestore().collection(Collections.Company).doc(companyId).set({
                roleCount: {
                    ...companySnapshot.data().roleCount,
                    [userRole]: newRoleCount,
                }
            }, { merge: true });
        } else if (afterData.type !== beforeData.type) {
            const companyId = afterData.companyId;
            const newUserRole = afterData.type;
            const oldUserRole = beforeData.type;

            const companySnapshot = await passedInAdmin.firestore().collection(Collections.Company).doc(companyId).get();

            const newRoleCount = companySnapshot.data().roleCount[newUserRole] + 1;
            const oldRoleCount = companySnapshot.data().roleCount[oldUserRole] - 1;

            console.log('newUserRole: ', newUserRole);
            console.log('oldUserRole: ', oldUserRole);

            console.log('newRoleCount: ', newRoleCount);
            console.log('oldRoleCount: ', oldRoleCount);

            await passedInAdmin.firestore().collection(Collections.Company).doc(companyId).set({
                roleCount: {
                    ...companySnapshot.data().roleCount,
                    [newUserRole]: newRoleCount,
                    [oldUserRole]: oldRoleCount,
                }
            }, { merge: true });
        }
    });