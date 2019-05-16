import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
import sgMail = require('@sendgrid/mail');
import { Collections } from '../models/collections';
import { ICloudFunctionUserCreateRequest } from '../models/userCreateRequest';

export const createUserLocal = (auth: admin.auth.Auth, firestore: FirebaseFirestore.Firestore) => functions.https.onCall(async(data: ICloudFunctionUserCreateRequest, context) => {
    const authUserId = context.auth.uid;

    const userQueryPromise = firestore.collection(Collections.CompanyUser)
        .where('authUserId', '==', authUserId)
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

    if (!userExists) {
        throw new functions.https.HttpsError('permission-denied', 'The requesting user does not exist on this company');
    }

    const userIsActive = userQuerySnapshot.docs[0].data().isActive;

    if (!userIsActive) {
        throw new functions.https.HttpsError('permission-denied', 'The requesting user is not active on this company');
    }

    const isAdmin = userQuerySnapshot.docs[0].data().type === UserType.Admin;

    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'The requesting user is not an admin user');
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
                    name: data.name,
                    companyName: companyDocumentSnapshot.data().companyName,
                    email: data.email,
                    password,
                }
            }
            await sgMail.send(msg);
        } catch (e) {
            console.log('The send grid email did not work. Here is the email: ', e);
        }
    }

    const userIsInactiveOnCompany = !userWeAreTryingToCreateSnapshot.empty && !userWeAreTryingToCreateSnapshot.docs[0].data().isActive;
    let companyUserId: string;

    if (userIsInactiveOnCompany) {
        const userToUpdate = {
            name: data.name,
            type: data.type,
            authUserId: userRecord.uid,
            isActive: true,
        }

        if (data.scanCheckpointIds && data.type !== UserType.Doctor) {
            (userToUpdate as any).scanCheckpointIds = data.scanCheckpointIds;
        }

        if (data.telephone && data.type === UserType.Doctor) {
            (userToUpdate as any).telephone = data.telephone;
        }

        if (data.address && data.type === UserType.Doctor) {
            (userToUpdate as any).address = data.address;
        }

        companyUserId = userWeAreTryingToCreateSnapshot.docs[0].id;

        await firestore.collection(Collections.CompanyUser)
            .doc(companyUserId)
            .set(userToUpdate, {
                merge: true,
            })
    } else {
        const userToCreate = {
            companyId: data.companyId,
            email: data.email,
            name: data.name,
            type: data.type,
            authUserId: userRecord.uid,
            isActive: true,
        }

        if (data.scanCheckpointIds && data.type !== UserType.Doctor) {
            (userToCreate as any).scanCheckpointIds = data.scanCheckpointIds;
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

    await firestore.collection(Collections.CompanyAuthUserJoin)
        .doc(companyUserJoinCompositeIndex)
        .set({
            companyId: data.companyId,
            companyName: companyDocumentSnapshot.data().companyName,
            authUserId: userRecord.uid,
            companyUserId: companyUserId,
        });

    const fullyUpdatedUserSnapshot = await firestore.collection(Collections.CompanyUser)
        .doc(companyUserId)
        .get();

    return {
        ...fullyUpdatedUserSnapshot.data(),
        id: companyUserId,
    };
})
