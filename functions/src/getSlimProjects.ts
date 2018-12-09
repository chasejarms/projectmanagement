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
        const slimProjects = await passedInAdmin.firestore().collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .get();

        const slimProjectsList = [];
        slimProjects.forEach((document) => {
            slimProjectsList.push(document.data());
        })
        console.log(slimProjectsList);
        return slimProjectsList;
    } else {
        // change this to only return the project corresponding to that company
        const slimProjects = await passedInAdmin.firestore().collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .get();

        const slimProjectsList = [];
        console.log(slimProjectsList);
        slimProjects.forEach((document) => {
            const slimProject = document.data();
            slimProject.projectId = document.id;
            slimProjectsList.push(slimProject);
        })
        return slimProjectsList;
    }
});