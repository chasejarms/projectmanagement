import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-develop.firebaseio.com',
})

export const signUp = functions.https.onCall(async(data, context) => {
    console.log('incoming data');
    console.log(data);
    const companyDocumentRef = await admin.firestore().collection('companies').doc(data.companyName).get();
    const companyAlreadyExists = companyDocumentRef.exists;

    console.log(`${data.companyName} already exists.`);
    if (companyAlreadyExists) {
        throw new functions.https.HttpsError('already-exists', 'The company you\'re trying to create already exists.');
    }

    // create the company
    await admin.firestore().collection('companies').doc(data.companyName).set({
        companyName: data.companyName,
        caseNotesTemplate: '',
        workflow: [],
    });
    console.log(`${data.companyName} was created.`);

    let user: admin.auth.UserRecord;

    try {
        console.log(`Trying to fetch a user with email: ${data.email}.`);
        user = await admin.auth().getUserByEmail(data.email);
    } catch (error) {
        console.log(`Trying to create a user with email: ${data.email}.`);
        user = await admin.auth().createUser({
            email: data.email,
            password: data.password,
        });
    }

    await admin.firestore()
        .collection('companies')
        .doc(data.companyName)
        .collection('users')
        .doc(user.uid)
        .set({
            fullName: data.fullName,
            email: data.email,
            type: 'Admin',
            scanCheckpoints: [],
        });

    return { user };
});

export const getSlimProjects = functions.https.onCall(async(companyName, context) => {
    // check if the user is an admin or staff
    const uid = context.auth.uid;
    console.log('uid is: ', uid);
    const userDocumentSnapshot = await app.firestore().collection('companies')
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
        return await app.firestore().collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .get();
    } else {
        // change this to only return the project corresponding to that company
        return await app.firestore().collection('companies')
            .doc(companyName)
            .collection('slimProjects')
            .get();
    }
});


