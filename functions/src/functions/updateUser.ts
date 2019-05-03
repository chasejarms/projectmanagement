
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserType } from '../models/userTypes';
import { IUnitedStatesAddress } from '../models/unitedStatesAddress';

interface IUser {
    id: string;
    uid: string;
    companyId: string;
    email: string;
    fullName: string;
    type: UserType;
    mustResetPassword: boolean;
    scanCheckpoints: string[];
    address?: IUnitedStatesAddress;
    telephone?: string;
}

export const updateUserLocal = (passedInAdmin: admin.app.App) => functions.https.onCall(async(data: IUser, context) => {
    console.log('update user is being called');
    const firestore = passedInAdmin.firestore();
    const uid = context.auth.uid;
    console.log('uid is: ', uid);

    const userQueryPromise = firestore.collection('users')
        .where('uid', '==', uid)
        .where('companyId', '==', data.companyId)
        .get();

    const userWeAreTryingToUpdate = firestore.collection('users')
        .where('uid', '==', data.uid)
        .where('companyId', '==', data.companyId)
        .get();

    const [
        userQuerySnapshot,
        userWeAreTryingToUpdateSnapshot,
    ] = await Promise.all([
        userQueryPromise,
        userWeAreTryingToUpdate,
    ])

    const isAdmin = userQuerySnapshot.docs[0].data().type === UserType.Admin;

    if (!isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'You are not an admin user');
    }

    if (userWeAreTryingToUpdateSnapshot.empty) {
        throw new functions.https.HttpsError('invalid-argument', 'The user you are trying to update does not exist');
    }

    const userBeforeUpdate = userWeAreTryingToUpdateSnapshot.docs[0].data() as IUser;
    const isUpdatingSelf = context.auth.uid === userBeforeUpdate.uid;
    const updatedUser = {
        email: data.email,
        fullName: data.fullName,
        type: isUpdatingSelf ? userBeforeUpdate.type : data.type,
    };

    console.log('updatedUser before checking type: ', updatedUser);

    if (userBeforeUpdate.type === UserType.Admin && data.type !== UserType.Admin) {
        console.log('trying to change the last admin user');
        const adminUsersQuerySnapshot = await firestore.collection('users')
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
        updatedUser['scanCheckpoints'] = data.scanCheckpoints;
    }

    if (Object.keys(updatedUser).length === 0) {
        return {
            ...userWeAreTryingToUpdateSnapshot.docs[0].data(),
            id: userWeAreTryingToUpdateSnapshot.docs[0].id,
        }
    } else {
        await firestore.collection('users')
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
