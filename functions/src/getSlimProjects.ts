import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const getSlimProjectsLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(companyName, context) => {
    // check if the user is an admin or staff
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const userDocumentSnapshot = await passedInAdmin.firestore().collection('companies')
        .doc(companyName)
        .collection('users')
        .doc(uid)
        .get();

    console.log('userDocumentSnapshot: ', userDocumentSnapshot);

    if (!userDocumentSnapshot.exists) {
        return Promise.reject('That user does not exist.');
    }

    const userType = userDocumentSnapshot.data().type;
    console.log('userType: ', userType);
    const isAdminOrStaff = userType === 'admin' || userType === 'staff';
    console.log('isAdminOrStaff: ', isAdminOrStaff);

    if (isAdminOrStaff) {
        return await passedInAdmin.firestore().collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .get();
    } else {
        // change this to only return the project corresponding to that company
        return await passedInAdmin.firestore().collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .get();
    }
});