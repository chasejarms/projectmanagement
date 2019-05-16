import * as functionsTest from 'firebase-functions-test';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { WrappedFunction } from 'firebase-functions-test/lib/main';
import { deleteUser } from '../../src';
import { auth } from '../../src/initialization';
import { ICloudFunctionsDeleteUserRequest } from '../../src/models/deleteUserRequest';
import { generateUniqueId } from '../../src/utils/generateUniqueId';
import { UserType } from '../../src/models/userTypes';
import { Collections } from '../../src/models/collections';

const testEnv = functionsTest({
    databaseURL: "https://shentaro-test.firebaseio.com",
    projectId: "shentaro-test",
    storageBucket: "shentaro-test.appspot.com",
}, './service-account.json');

describe('deleteUser', () => {
    let requestingUserCompanyId: string;
    let requestingUserCompanyUserId: string;
    let requestingUserAuthUserId: string;

    let userToDeleteCompanyUserId: string;
    let userToDeleteAuthUserId: string;
    let companyAuthUserJoinToDeleteId: string;

    let initialDeleteUserRequest: ICloudFunctionsDeleteUserRequest;
    let wrapped: WrappedFunction;

    beforeEach(() => {
        requestingUserCompanyId = generateUniqueId();
        requestingUserCompanyUserId = generateUniqueId();
        requestingUserAuthUserId = generateUniqueId();

        userToDeleteCompanyUserId = generateUniqueId();
        userToDeleteAuthUserId = generateUniqueId();
        companyAuthUserJoinToDeleteId = `${requestingUserCompanyId}_${userToDeleteAuthUserId}`;

        initialDeleteUserRequest = {
            id: userToDeleteCompanyUserId,
            uidOfUserToDelete: userToDeleteAuthUserId,
            companyId: requestingUserCompanyId,
        }
    });

    beforeAll(() => {
        wrapped = testEnv.wrap(deleteUser);
    });

    afterAll(() => {
        testEnv.cleanup();
    });

    test('it does not allow deleting a user if the requesting user does not exist on the company or is not active', async() => {
        let requestingUserDoesNotExistOnCompanyError: string = '';
        try {
            await wrapped(initialDeleteUserRequest, { auth: { uid: requestingUserAuthUserId }});
        } catch (error) {
            const httpsError = error as functions.https.HttpsError;
            requestingUserDoesNotExistOnCompanyError = httpsError.message;
        }

        expect(requestingUserDoesNotExistOnCompanyError).toBe('The requesting user does not exist on this company');

        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            name: 'me',
            isActive: false,
            scanCheckpointIds: [],
            type: UserType.Admin,
            authUserId: requestingUserAuthUserId,
        }
        await admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        let requestingCompanyUserIsNotActiveError: string = '';
        try {
            await wrapped(initialDeleteUserRequest, { auth: { uid: requestingUserAuthUserId }});
        } catch (error) {
            const httpsError = error as functions.https.HttpsError;
            requestingCompanyUserIsNotActiveError = httpsError.message;
        }

        expect(requestingCompanyUserIsNotActiveError).toBe('The requesting user is not active on this company');
    })

    test('it does not allow deleting a user if the requesting user is not an admin on the company', async() => {
        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            name: 'me',
            isActive: true,
            scanCheckpointIds: [],
            type: UserType.Staff,
            authUserId: requestingUserAuthUserId,
        }
        await admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        let requestingUserIsNotAdminError: string = '';
        try {
            await wrapped(initialDeleteUserRequest, { auth: { uid: requestingUserAuthUserId }});
        } catch (error) {
            const httpsError = error as functions.https.HttpsError;
            requestingUserIsNotAdminError = httpsError.message;
        }

        expect(requestingUserIsNotAdminError).toBe('The requesting user is not an admin user');
    })

    test('it does not allow deleting if we are trying to delete our own user', async() => {
        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            name: 'me',
            isActive: true,
            scanCheckpointIds: [],
            type: UserType.Admin,
            authUserId: requestingUserAuthUserId,
        }
        await admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const deleteOwnUserRequest = {
            id: requestingUserCompanyUserId,
            uidOfUserToDelete: requestingUserAuthUserId,
            companyId: requestingUserCompanyId,
        }

        let cannotDeleteOwnUserError: string = '';

        try {
            await wrapped(deleteOwnUserRequest, { auth: { uid: requestingUserAuthUserId }});
        } catch (error) {
            const httpsError = error as functions.https.HttpsError;
            cannotDeleteOwnUserError = httpsError.message;
        }

        expect(cannotDeleteOwnUserError).toBe('You cannot delete your own user from the system');
    });

    test('it deletes the auth user if the company user is only active on this company', async() => {
        let deleteAuthUserWasCalled: boolean = false;
        jest.spyOn(auth, 'deleteUser').mockImplementation(() => {
            deleteAuthUserWasCalled = true;
            return Promise.resolve();
        });

        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            name: 'me',
            isActive: true,
            scanCheckpointIds: [],
            type: UserType.Admin,
            authUserId: requestingUserAuthUserId,
        }

        const requestingUserCompanyUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const companyUserWeWillTryDeleting = {
            companyId: requestingUserCompanyId,
            email: 'personToDelete@personToDelete.com',
            name: 'Jane Doe',
            isActive: true,
            scanCheckpointIds: [],
            type: UserType.Staff,
            authUserId: userToDeleteAuthUserId,
        }

        const userWeWillTryDeletingCompanyUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(userToDeleteCompanyUserId)
            .set(companyUserWeWillTryDeleting);

        const companyAuthUserJoinOne = {
            companyId: requestingUserCompanyId,
            authUserId: userToDeleteAuthUserId,
            companyUserId: userToDeleteCompanyUserId,
        }

        const companyAuthUserJoinOneId = generateUniqueId();
        const companyAuthUserJoinOnePromise = admin.firestore().collection(Collections.CompanyAuthUserJoin)
            .doc(companyAuthUserJoinOneId)
            .set(companyAuthUserJoinOne);

        const companyUserIdOnOtherCompany = generateUniqueId();
        const otherCompanyId = generateUniqueId();
        const companyUserOnOtherCompany = {
            companyId: otherCompanyId,
            email: 'personToDelete@personToDelete.com',
            name: 'Jane Doe',
            isActive: true,
            scanCheckpointIds: [],
            type: UserType.Staff,
            authUserId: userToDeleteAuthUserId,
        }

        const otherUserCompanyUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(companyUserIdOnOtherCompany)
            .set(companyUserOnOtherCompany);

        const companyAuthUserJoinTwo = {
            companyId: otherCompanyId,
            authUserId: userToDeleteAuthUserId,
            companyUserId: companyUserIdOnOtherCompany,
        }

        const companyAuthUserJoinTwoId = generateUniqueId();
        const companyAuthUserJoinTwoPromise = admin.firestore().collection(Collections.CompanyAuthUserJoin)
            .doc(companyAuthUserJoinTwoId)
            .set(companyAuthUserJoinTwo);

        await Promise.all([
            requestingUserCompanyUserPromise,
            userWeWillTryDeletingCompanyUserPromise,
            otherUserCompanyUserPromise,
            companyAuthUserJoinOnePromise,
            companyAuthUserJoinTwoPromise,
        ]);

        await wrapped(initialDeleteUserRequest, { auth: { uid: requestingUserAuthUserId }});
        expect(deleteAuthUserWasCalled).toBe(false);

        const deleteOtherCompanyUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(companyUserIdOnOtherCompany)
            .delete();

        const userWeWillTryRedeletingCompanyUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(userToDeleteCompanyUserId)
            .set(companyUserWeWillTryDeleting);

        await Promise.all([
            deleteOtherCompanyUserPromise,
            userWeWillTryRedeletingCompanyUserPromise,
        ])

        await wrapped(initialDeleteUserRequest, { auth: { uid: requestingUserAuthUserId }});
        expect(deleteAuthUserWasCalled).toBe(true);
    });

    test('it sets the isActive flag to false on the company user we are trying to delete', async() => {
        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            name: 'me',
            isActive: true,
            scanCheckpointIds: [],
            type: UserType.Admin,
            authUserId: requestingUserAuthUserId,
        }

        const requestingUserCompanyUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const companyUserWeWillTryDeleting = {
            companyId: requestingUserCompanyId,
            email: 'personToDelete@personToDelete.com',
            name: 'Jane Doe',
            isActive: true,
            scanCheckpointIds: [],
            type: UserType.Staff,
            authUserId: userToDeleteAuthUserId,
        }

        const userWeWillTryDeletingCompanyUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(userToDeleteCompanyUserId)
            .set(companyUserWeWillTryDeleting);

        const companyAuthUserJoinOne = {
            companyId: requestingUserCompanyId,
            authUserId: userToDeleteAuthUserId,
            companyUserId: userToDeleteCompanyUserId,
        }

        const companyAuthUserJoinOneId = generateUniqueId();
        const companyAuthUserJoinOnePromise = admin.firestore().collection(Collections.CompanyAuthUserJoin)
            .doc(companyAuthUserJoinOneId)
            .set(companyAuthUserJoinOne);

        await Promise.all([
            requestingUserCompanyUserPromise,
            userWeWillTryDeletingCompanyUserPromise,
            companyAuthUserJoinOnePromise,
        ])

        await wrapped(initialDeleteUserRequest, { auth: { uid: requestingUserAuthUserId }});

        const companyUserThatWasDeleted = await admin.firestore().collection(Collections.CompanyUser)
            .doc(userToDeleteCompanyUserId)
            .get();

        expect(companyUserThatWasDeleted.exists).toBe(true);
        expect(companyUserThatWasDeleted.data().isActive).toBe(false);
    });

    test('it deletes the company auth user join corresponding to the user we are trying to delete', async() => {
        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            name: 'me',
            isActive: true,
            scanCheckpointIds: [],
            type: UserType.Admin,
            authUserId: requestingUserAuthUserId,
        }

        const requestingUserCompanyUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const companyUserWeWillTryDeleting = {
            companyId: requestingUserCompanyId,
            email: 'personToDelete@personToDelete.com',
            name: 'Jane Doe',
            isActive: true,
            scanCheckpointIds: [],
            type: UserType.Staff,
            authUserId: userToDeleteAuthUserId,
        }

        const userWeWillTryDeletingCompanyUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(userToDeleteCompanyUserId)
            .set(companyUserWeWillTryDeleting);

        const companyAuthUserJoinOne = {
            companyId: requestingUserCompanyId,
            authUserId: userToDeleteAuthUserId,
            companyUserId: userToDeleteCompanyUserId,
        }

        const companyAuthUserJoinOnePromise = admin.firestore().collection(Collections.CompanyAuthUserJoin)
            .doc(companyAuthUserJoinToDeleteId)
            .set(companyAuthUserJoinOne);

        await Promise.all([
            requestingUserCompanyUserPromise,
            userWeWillTryDeletingCompanyUserPromise,
            companyAuthUserJoinOnePromise,
        ])

        await wrapped(initialDeleteUserRequest, { auth: { uid: requestingUserAuthUserId }});

        const companyAuthUserJoinThatWasDeleted = await admin.firestore().collection(Collections.CompanyAuthUserJoin)
            .doc(companyAuthUserJoinToDeleteId)
            .get();

        expect(companyAuthUserJoinThatWasDeleted.exists).toBe(false);
    });
});