import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createCompanyLocal = (passedInAdmin: admin.app.App) => functions.https.onRequest(async(request, response) => {
    const {
        companyName,
        email,
        password,
    } = request.body

    // first, see if the company or the user already exist
    // if either one of them does, return an http error

    const companyPromise = passedInAdmin.firestore().collection('companies').where('companyName', '==', companyName).get();
    const userPromise = passedInAdmin.auth().getUserByEmail(email);
    
    const initialValidation = Promise.all([companyPromise, userPromise]);

    try {
        await initialValidation;
    } catch ([companyError, userError]) {
        if (companyError && userError) {
            return response.status(400).send('The company name and the user name are taken.');
        } else if (companyError) {
            return response.status(400).send('The company name is taken.');
        } else {
            return response.status(400).send('The email is taken.')
        }
    }

    // create the authenticated user

    try {
        await passedInAdmin.auth().createUser({
            email,
            password,
            emailVerified: false,
        });
    } catch (error) {
        return response.status(400).send('We were not able to create the user. Please try again later.');
    }

    // create the company with a subcollection of users where
    // the requesting user is the admin user
    const companiesCollection = passedInAdmin.firestore().collection('companies');
    const documentReference = await companiesCollection.add({
        companyName,
    });

    await companiesCollection.doc(documentReference.id).collection('users').add({
        email,
        role: 'admin'
    });
});