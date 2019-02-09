import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
import sgMail = require('@sendgrid/mail');
import { IUnitedStatesAddress } from '../models/unitedStatesAddress';

interface IUserCreateRequest {
    companyId: string;
    email: string;
    fullName: string;
    type: UserType;
    scanCheckpoints?: string[];
    address?: IUnitedStatesAddress;
    telephone?: IUserCreateRequest;
}

export const createUserLocal = (auth: admin.auth.Auth, firestore: FirebaseFirestore.Firestore) => functions.https.onCall(async(data: IUserCreateRequest, context) => {
    const uid = context.auth.uid;
    console.log('uid is: ', uid);

    const userQueryPromise = firestore.collection('users')
        .where('uid', '==', uid)
        .where('companyId', '==', data.companyId)
        .get();

    const userWeAreTryingToCreatePromise = firestore.collection('users')
        .where('email', '==', data.email)
        .where('companyId', '==', data.companyId)
        .get();

    const companyDocumentPromise = firestore.collection('companies')
        .doc(data.companyId)
        .get();

    const [
        userQuerySnapshot,
        userWeAreTryingToCreateSnapshot,
        companyDocumentSnapshot,
    ] = await Promise.all([
        userQueryPromise,
        userWeAreTryingToCreatePromise,
        companyDocumentPromise,
    ])

    const isAdmin = userQuerySnapshot.docs[0].data().type === UserType.Admin;

    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }

    if (!userWeAreTryingToCreateSnapshot.empty) {
        throw new functions.https.HttpsError('already-exists', 'That user already exists');
    }

    let userRecord: admin.auth.UserRecord;

    try {
        userRecord = await auth.getUserByEmail(data.email);
    } catch {
        const password = Math.random().toString(36).slice(-8);
        userRecord = await auth.createUser({
            email: data.email,
            password,
        });

        const SEND_GRID_API_KEY = functions.config().sendgrid.key;
        sgMail.setApiKey(SEND_GRID_API_KEY);
        try {
            const msg = {
                to: data.email,
                from: 'noreply@shentaro.com',
                templateId: 'd-cbbbc673651741c68a16e6d496002018',
                substitutionWrappers: ['{{', '}}'],
                dynamicTemplateData: {
                    fullName: data.fullName,
                    companyName: companyDocumentSnapshot.data().companyName,
                    email: data.email,
                    password,
                }
            }
            const sendGridResponse = await sgMail.send(msg);
            console.log('sendGridResponse status code: ', sendGridResponse[0].statusCode);
            console.log('sendGridResponse status message: ', sendGridResponse[0].statusMessage);
            console.log('sendGridResponse body: ', sendGridResponse[0].body);
        } catch (e) {
            console.log('The send grid email did not work. Here is the email: ', e);
        }
    }

    const userToCreate = {
        companyId: data.companyId,
        email: data.email,
        fullName: data.fullName,
        type: data.type,
        uid: userRecord.uid,
    }

    if (data.scanCheckpoints && data.type !== UserType.Doctor) {
        (userToCreate as any).scanCheckpoints = data.scanCheckpoints;
    }

    if (data.telephone && data.type === UserType.Doctor) {
        (userToCreate as any).telephone = data.telephone;
    }

    if (data.address && data.type === UserType.Doctor) {
        (userToCreate as any).address = data.address;
    }

    const createdUserDocumentSnapshot = await firestore.collection('users').add(userToCreate);

    await firestore.collection('companyUserJoin')
        .doc(`${data.companyId}_${userRecord.uid}`)
        .set({
            companyId: data.companyId,
            companyName: companyDocumentSnapshot.data().companyName,
            firebaseAuthenticationUid: userRecord.uid,
            userId: createdUserDocumentSnapshot.id,
        });

    return {
        ...userToCreate,
        id: createdUserDocumentSnapshot.id,
    };
})
