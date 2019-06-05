
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
import { IUnitedStatesAddress } from '../models/unitedStatesAddress';
import { Collections } from '../models/collections';

interface IUser {
    id: string;
    authUserId: string;
    companyId: string;
    email: string;
    name: string;
    type: UserType;
    mustResetPassword: boolean;
    scanCheckpointIds: string[];
    address?: IUnitedStatesAddress;
    telephone?: string;
}

export const updateUserLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data: IUser, context) => {
    console.log('update user is being called');
    const firestore = passedInAdmin.firestore();
    const authUserId = context.auth.uid;
    console.log('auth user id is: ', authUserId);

    const userQueryPromise = firestore.collection(Collections.CompanyUser)
        .where('authUserId', '==', authUserId)
        .where('companyId', '==', data.companyId)
        .get();

    const userWeAreTryingToUpdate = firestore.collection(Collections.CompanyUser)
        .where('authUserId', '==', data.authUserId)
        .where('companyId', '==', data.companyId)
        .get();

    const [
        userQuerySnapshot,
        userWeAreTryingToUpdateSnapshot,
    ] = await Promise.all([
        userQueryPromise,
        userWeAreTryingToUpdate,
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

    if (userWeAreTryingToUpdateSnapshot.empty) {
        throw new functions.https.HttpsError('invalid-argument', 'The user you are trying to update does not exist');
    }

    const userBeforeUpdate = userWeAreTryingToUpdateSnapshot.docs[0].data() as IUser;
    const isUpdatingSelf = context.auth.uid === userBeforeUpdate.authUserId;
    const updatedUser = {
        name: data.name,
        type: isUpdatingSelf ? userBeforeUpdate.type : data.type,
    };

    console.log('updatedUser before checking type: ', updatedUser);

    if (userBeforeUpdate.type === UserType.Admin && data.type !== UserType.Admin) {
        console.log('trying to change the last admin user');
        const adminUsersQuerySnapshot = await firestore.collection(Collections.CompanyUser)
            .where('companyId', '==', data.companyId)
            .where('type', '==', UserType.Admin)
            .limit(2)
            .get()

        if (adminUsersQuerySnapshot.size < 1) {
            throw new functions.https.HttpsError('invalid-argument', 'You cannot change the last Admin user.')
        }
    }

    if (updatedUser.type === UserType.Doctor) {
        updatedUser['address'] = data.address;
        updatedUser['telephone'] = data.telephone;
    } else {
        updatedUser['scanCheckpointIds'] = data.scanCheckpointIds;
    }

    if (Object.keys(updatedUser).length === 0) {
        return {
            ...userWeAreTryingToUpdateSnapshot.docs[0].data(),
            id: userWeAreTryingToUpdateSnapshot.docs[0].id,
        }
    } else {
        await firestore.collection(Collections.CompanyUser)
            .doc(userWeAreTryingToUpdateSnapshot.docs[0].id)
            .set(updatedUser, {
                merge: true,
            })

        console.log('returned value: ', {
            ...userWeAreTryingToUpdateSnapshot.docs[0].data(),
            ...updatedUser,
            id: userWeAreTryingToUpdateSnapshot.docs[0].id,
        })

        return {
            ...userWeAreTryingToUpdateSnapshot.docs[0].data(),
            ...updatedUser,
            id: userWeAreTryingToUpdateSnapshot.docs[0].id,
        }
    }
})
