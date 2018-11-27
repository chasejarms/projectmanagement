import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const signUpLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data, context) => {
    console.log('incoming data');
    console.log(data);
    const companyDocumentRef = await passedInAdmin.firestore().collection('companies').doc(data.companyName).get();
    const companyAlreadyExists = companyDocumentRef.exists;

    console.log(`${data.companyName} already exists.`);
    if (companyAlreadyExists) {
        throw new functions.https.HttpsError('already-exists', 'The company you\'re trying to create already exists.');
    }

    // create the company
    await passedInAdmin.firestore().collection('companies').doc(data.companyName).set({
        companyName: data.companyName,
        caseNotesTemplate: '',
        workflow: [],
    });
    console.log(`${data.companyName} was created.`);

    let user: admin.auth.UserRecord;

    try {
        console.log(`Trying to fetch a user with email: ${data.email}.`);
        user = await passedInAdmin.auth().getUserByEmail(data.email);
    } catch (error) {
        console.log(`Trying to create a user with email: ${data.email}.`);
        user = await passedInAdmin.auth().createUser({
            email: data.email,
            password: data.password,
        });
    }

    await passedInAdmin.firestore()
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