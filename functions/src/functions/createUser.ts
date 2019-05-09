import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
import sgMail = require('@sendgrid/mail');
import { IUnitedStatesAddress } from '../models/unitedStatesAddress';
import { Collections } from '../models/collections';

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

    console.log('data: ', data);

    const userQueryPromise = firestore.collection(Collections.CompanyUser)
        .where('uid', '==', uid)
        .where('companyId', '==', data.companyId)
        .get();

    const userWeAreTryingToCreatePromise = firestore.collection(Collections.CompanyUser)
        .where('email', '==', data.email)
        .where('companyId', '==', data.companyId)
        .get();

    const companyDocumentPromise = firestore.collection(Collections.Company)
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

    const userExists = userQuerySnapshot.docs.length > 0;
    console.log('userExists: ', userExists);

    if (!userExists) {
        throw new functions.https.HttpsError('permission-denied', 'The requesting user does not exist on this company');
    }

    const userIsActive = userQuerySnapshot.docs[0].data().isActive;
    console.log('userIsActive: ', userIsActive);

    if (!userIsActive) {
        throw new functions.https.HttpsError('permission-denied', 'The requesting user is not active on this company');
    }

    const isAdmin = userQuerySnapshot.docs[0].data().type === UserType.Admin;
    console.log('isAdmin: ', isAdmin);

    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }

    if (!userWeAreTryingToCreateSnapshot.empty && userWeAreTryingToCreateSnapshot.docs[0].data().isActive) {
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

    const userIsInactiveOnCompany = !userWeAreTryingToCreateSnapshot.empty && !userWeAreTryingToCreateSnapshot.docs[0].data().isActive;
    let companyUserId: string;

    if (userIsInactiveOnCompany) {
        const userToUpdate = {
            fullName: data.fullName,
            type: data.type,
            uid: userRecord.uid,
            isActive: true,
        }

        if (data.scanCheckpoints && data.type !== UserType.Doctor) {
            (userToUpdate as any).scanCheckpoints = data.scanCheckpoints;
        }

        if (data.telephone && data.type === UserType.Doctor) {
            (userToUpdate as any).telephone = data.telephone;
        }

        if (data.address && data.type === UserType.Doctor) {
            (userToUpdate as any).address = data.address;
        }

        companyUserId = userWeAreTryingToCreateSnapshot.docs[0].id;

        console.log('companyUserId: ', companyUserId);

        console.log('userToUpdate: ', userToUpdate);

        await firestore.collection(Collections.CompanyUser)
            .doc(companyUserId)
            .set(userToUpdate, {
                merge: true,
            })
    } else {
        const userToCreate = {
            companyId: data.companyId,
            email: data.email,
            fullName: data.fullName,
            type: data.type,
            uid: userRecord.uid,
            isActive: true,
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

        const createdUserDocumentSnapshot = await firestore.collection(Collections.CompanyUser).add(userToCreate);

        companyUserId = createdUserDocumentSnapshot.id;
    }

    const companyUserJoinCompositeIndex = `${data.companyId}_${userRecord.uid}`;
    console.log('companyUserJoinCompositeIndex: ', companyUserJoinCompositeIndex);

    await firestore.collection(Collections.CompanyAuthUserJoin)
        .doc(companyUserJoinCompositeIndex)
        .set({
            companyId: data.companyId,
            companyName: companyDocumentSnapshot.data().companyName,
            firebaseAuthenticationUid: userRecord.uid,
            userId: companyUserId,
        });

    const fullyUpdatedUserSnapshot = await firestore.collection(Collections.CompanyUser)
        .doc(companyUserId)
        .get();

    return {
        ...fullyUpdatedUserSnapshot.data(),
        id: companyUserId,
    };
})
