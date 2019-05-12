import * as functionsTest from 'firebase-functions-test';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { WrappedFunction } from 'firebase-functions-test/lib/main';
import { ICloudFunctionUserCreateRequest } from '../../src/models/userCreateRequest';
import { generateUniqueId } from '../../src/utils/generateUniqueId';
import { UserType } from '../../src/models/userTypes';
import { createUser } from '../../src';
import { auth } from '../../src/initialization';
import { Collections } from '../../src/models/collections';

import sgMail = require('@sendgrid/mail');
// tslint:disable-next-line:no-implicit-dependencies
import { MailData } from '@sendgrid/helpers/classes/mail';

const testEnv = functionsTest({
    databaseURL: "https://shentaro-test.firebaseio.com",
    projectId: "shentaro-test",
    storageBucket: "shentaro-test.appspot.com",
}, './service-account.json');

testEnv.mockConfig({
    sendgrid: {
        key: '1234',
    }
})

describe.only('createUser', () => {
    let requestingUserCompanyId: string;
    let requestingUserCompanyUserId: string;
    let requestingUserAuthUserId: string;

    let userWeAreCreatingAuthUserId: string;

    let initialUserCreateRequest: ICloudFunctionUserCreateRequest;
    let wrapped: WrappedFunction;

    beforeEach(() => {
        requestingUserCompanyId = generateUniqueId();
        requestingUserCompanyUserId = generateUniqueId();
        requestingUserAuthUserId = generateUniqueId();

        userWeAreCreatingAuthUserId = generateUniqueId();

        initialUserCreateRequest = {
            companyId: requestingUserCompanyId,
            email: 'jim@theoffice.com',
            fullName: 'Jim Halpert',
            type: UserType.Staff,
        }
    });

    beforeAll(() => {
        wrapped = testEnv.wrap(createUser);
    });

    afterAll(() => {
        testEnv.cleanup();
    });

    test('it does not allow creating a user if the requesting user does not exist on the company or is not active', async() => {
        let requestingUserDoesNotExistOnCompanyError: string = '';
        try {
            await wrapped(initialUserCreateRequest, { auth: { uid: requestingUserAuthUserId }});
        } catch (error) {
            const httpsError = error as functions.https.HttpsError;
            requestingUserDoesNotExistOnCompanyError = httpsError.message;
        }

        expect(requestingUserDoesNotExistOnCompanyError).toBe('The requesting user does not exist on this company');

        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            fullName: 'me',
            isActive: false,
            scanCheckpoints: [],
            type: UserType.Admin,
            uid: requestingUserAuthUserId,
        }
        await admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        let requestingCompanyUserIsNotActiveError: string = '';
        try {
            await wrapped(initialUserCreateRequest, { auth: { uid: requestingUserAuthUserId }});
        } catch (error) {
            const httpsError = error as functions.https.HttpsError;
            requestingCompanyUserIsNotActiveError = httpsError.message;
        }

        expect(requestingCompanyUserIsNotActiveError).toBe('The requesting user is not active on this company');
    });

    test('it does not allow creating a user if the requesting user is not an admin on the company', async() => {
        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            fullName: 'me',
            isActive: true,
            scanCheckpoints: [],
            type: UserType.Staff,
            uid: requestingUserAuthUserId,
        }
        await admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        let requestingCompanyUserIsNotAnAdminError: string = '';
        try {
            await wrapped(initialUserCreateRequest, { auth: { uid: requestingUserAuthUserId }});
        } catch (error) {
            const httpsError = error as functions.https.HttpsError;
            requestingCompanyUserIsNotAnAdminError = httpsError.message;
        }

        expect(requestingCompanyUserIsNotAnAdminError).toBe('The requesting user is not an admin user');
    });

    test('it does not allow creating a user if the user to create already exists on the company and is active', async() => {
        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            fullName: 'me',
            isActive: true,
            scanCheckpoints: [],
            type: UserType.Admin,
            uid: requestingUserAuthUserId,
        }

        const userWeAreTryingToCreate = {
            ...initialUserCreateRequest,
            isActive: true,
        }

        const createRequestingUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const createOtherUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .add(userWeAreTryingToCreate);

        await Promise.all([
            createRequestingUserPromise,
            createOtherUserPromise,
        ]);

        let userAlreadyExistsError: string = '';
        try {
            await wrapped(initialUserCreateRequest, { auth: { uid: requestingUserAuthUserId }});
        } catch (error) {
            const httpsError = error as functions.https.HttpsError;
            userAlreadyExistsError = httpsError.message;
        }

        expect(userAlreadyExistsError).toBe('That user already exists');
    });

    test('it only creates the auth user if one does not already exist', async() => {
        jest.spyOn(auth, 'getUserByEmail').mockImplementation(() => {
            return Promise.reject();
        })

        let createUserWasCalled: boolean = false;
        jest.spyOn(auth, 'createUser').mockImplementation(() => {
            createUserWasCalled = true;
            return Promise.resolve<any>({
                uid: userWeAreCreatingAuthUserId,
            })
        });

        jest.spyOn(sgMail, 'setApiKey').mockImplementation(() => null);
        jest.spyOn(sgMail, 'send').mockImplementation(() => Promise.resolve<any>(null));

        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            fullName: 'me',
            isActive: true,
            scanCheckpoints: [],
            type: UserType.Admin,
            uid: requestingUserAuthUserId,
        }

        const createRequestingUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const createCompanyPromise = admin.firestore().collection(Collections.Company)
            .doc(requestingUserCompanyId)
            .set({
                companyId: requestingUserCompanyId,
                companyName: 'An Amazing Company',
            })

        await Promise.all([
            createRequestingUserPromise,
            createCompanyPromise,
        ]);

        await wrapped(initialUserCreateRequest, { auth: { uid: requestingUserAuthUserId }});

        expect(createUserWasCalled).toBe(true);
    });

    test('it sends a send grid email with the username and password if we are creating an auth user', async() => {
        jest.spyOn(auth, 'getUserByEmail').mockImplementation(() => {
            return Promise.reject();
        })

        let createUserWasCalled: boolean = false;
        jest.spyOn(auth, 'createUser').mockImplementation(() => {
            createUserWasCalled = true;
            return Promise.resolve<any>({
                uid: userWeAreCreatingAuthUserId,
            })
        });

        jest.spyOn(sgMail, 'setApiKey').mockImplementation(() => null);
        let message: MailData;
        jest.spyOn(sgMail, 'send').mockImplementation((messageParam: any) => {
            message = messageParam;
            return Promise.resolve<any>(null)
        });

        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            fullName: 'me',
            isActive: true,
            scanCheckpoints: [],
            type: UserType.Admin,
            uid: requestingUserAuthUserId,
        }

        const createRequestingUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const createCompanyPromise = admin.firestore().collection(Collections.Company)
            .doc(requestingUserCompanyId)
            .set({
                companyId: requestingUserCompanyId,
                companyName: 'An Amazing Company',
            })

        await Promise.all([
            createRequestingUserPromise,
            createCompanyPromise,
        ]);

        await wrapped(initialUserCreateRequest, { auth: { uid: requestingUserAuthUserId }});

        expect(message.dynamicTemplateData.email).toBe('jim@theoffice.com');
        expect(message.dynamicTemplateData.password).toBeDefined();
        expect(message.dynamicTemplateData.companyName).toBe('An Amazing Company');
        expect(message.dynamicTemplateData.fullName).toBe('Jim Halpert');
    });

    test('it overrides the existing company user if the company user was inactive', async() => {
        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            fullName: 'me',
            isActive: true,
            scanCheckpoints: [],
            type: UserType.Admin,
            uid: requestingUserAuthUserId,
        }

        const userWeAreTryingToCreate = {
            ...initialUserCreateRequest,
            isActive: false,
            fullName: 'Not Jim Halpert',
        }

        const createRequestingUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const createOtherUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .add(userWeAreTryingToCreate);

        const createCompanyPromise = admin.firestore().collection(Collections.Company)
            .doc(requestingUserCompanyId)
            .set({
                companyId: requestingUserCompanyId,
                companyName: 'An Amazing Company',
            })

        await Promise.all([
            createRequestingUserPromise,
            createOtherUserPromise,
            createCompanyPromise,
        ]);

        jest.spyOn(auth, 'getUserByEmail').mockImplementation(() => {
            return Promise.reject();
        })

        jest.spyOn(auth, 'createUser').mockImplementation(() => {
            return Promise.resolve<any>({
                uid: userWeAreCreatingAuthUserId,
            })
        });

        jest.spyOn(sgMail, 'setApiKey').mockImplementation(() => null);
        jest.spyOn(sgMail, 'send').mockImplementation((messageParam: any) => {
            return Promise.resolve<any>(null)
        });

        const returnedUser = await wrapped(initialUserCreateRequest, { auth: { uid: requestingUserAuthUserId }});
        const addedCompanyUserId = returnedUser.id;

        const createdUserSnapshot = await admin.firestore().collection(Collections.CompanyUser)
            .doc(addedCompanyUserId)
            .get();

        const fullName = createdUserSnapshot.data().fullName;
        expect(fullName).toBe(initialUserCreateRequest.fullName);
    });

    test('it creates a new company user if the company user does not exist', async() => {
        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            fullName: 'me',
            isActive: true,
            scanCheckpoints: [],
            type: UserType.Admin,
            uid: requestingUserAuthUserId,
        }

        const userWeAreTryingToCreate = {
            ...initialUserCreateRequest,
            isActive: false,
            fullName: 'Not Jim Halpert',
        }

        const createRequestingUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const createCompanyPromise = admin.firestore().collection(Collections.Company)
            .doc(requestingUserCompanyId)
            .set({
                companyId: requestingUserCompanyId,
                companyName: 'An Amazing Company',
            })

        await Promise.all([
            createRequestingUserPromise,
            createCompanyPromise,
        ]);

        jest.spyOn(auth, 'getUserByEmail').mockImplementation(() => {
            return Promise.reject();
        })

        jest.spyOn(auth, 'createUser').mockImplementation(() => {
            return Promise.resolve<any>({
                uid: userWeAreCreatingAuthUserId,
            })
        });

        jest.spyOn(sgMail, 'setApiKey').mockImplementation(() => null);
        jest.spyOn(sgMail, 'send').mockImplementation((messageParam: any) => {
            return Promise.resolve<any>(null)
        });

        const returnedUser = await wrapped(initialUserCreateRequest, { auth: { uid: requestingUserAuthUserId }});
        const addedCompanyUserId = returnedUser.id;

        const createdUserSnapshot = await admin.firestore().collection(Collections.CompanyUser)
            .doc(addedCompanyUserId)
            .get();

        expect(createdUserSnapshot.exists).toBe(true);
    });

    test('it creates the company auth user join', async() => {
        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            fullName: 'me',
            isActive: true,
            scanCheckpoints: [],
            type: UserType.Admin,
            uid: requestingUserAuthUserId,
        }

        const createRequestingUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const createCompanyPromise = admin.firestore().collection(Collections.Company)
            .doc(requestingUserCompanyId)
            .set({
                companyId: requestingUserCompanyId,
                companyName: 'An Amazing Company',
            })

        await Promise.all([
            createRequestingUserPromise,
            createCompanyPromise,
        ]);

        jest.spyOn(auth, 'getUserByEmail').mockImplementation(() => {
            return Promise.reject();
        })

        jest.spyOn(auth, 'createUser').mockImplementation(() => {
            return Promise.resolve<any>({
                uid: userWeAreCreatingAuthUserId,
            })
        });

        jest.spyOn(sgMail, 'setApiKey').mockImplementation(() => null);
        jest.spyOn(sgMail, 'send').mockImplementation((messageParam: any) => {
            return Promise.resolve<any>(null)
        });

        await wrapped(initialUserCreateRequest, { auth: { uid: requestingUserAuthUserId }});

        const addedUserCompanyAuthUserJoinId = `${requestingUserCompanyId}_${userWeAreCreatingAuthUserId}`;
        const addedUserCompanyAuthUserJoinSnapshot = await admin.firestore().collection(Collections.CompanyAuthUserJoin)
            .doc(addedUserCompanyAuthUserJoinId)
            .get()

        expect(addedUserCompanyAuthUserJoinSnapshot.exists).toBe(true);
    });

    test('it should return the user data', async() => {
        const requestingUserCompanyUserData = {
            companyId: requestingUserCompanyId,
            email: 'me@me.com',
            fullName: 'me',
            isActive: true,
            scanCheckpoints: [],
            type: UserType.Admin,
            uid: requestingUserAuthUserId,
        }

        const createRequestingUserPromise = admin.firestore().collection(Collections.CompanyUser)
            .doc(requestingUserCompanyUserId)
            .set(requestingUserCompanyUserData);

        const createCompanyPromise = admin.firestore().collection(Collections.Company)
            .doc(requestingUserCompanyId)
            .set({
                companyId: requestingUserCompanyId,
                companyName: 'An Amazing Company',
            })

        await Promise.all([
            createRequestingUserPromise,
            createCompanyPromise,
        ]);

        jest.spyOn(auth, 'getUserByEmail').mockImplementation(() => {
            return Promise.reject();
        })

        jest.spyOn(auth, 'createUser').mockImplementation(() => {
            return Promise.resolve<any>({
                uid: userWeAreCreatingAuthUserId,
            })
        });

        jest.spyOn(sgMail, 'setApiKey').mockImplementation(() => null);
        jest.spyOn(sgMail, 'send').mockImplementation((messageParam: any) => {
            return Promise.resolve<any>(null)
        });

        const addedUser = await wrapped(initialUserCreateRequest, { auth: { uid: requestingUserAuthUserId }});

        expect(addedUser.fullName).toBe(initialUserCreateRequest.fullName);
        expect(addedUser.companyId).toBe(initialUserCreateRequest.companyId);
        expect(addedUser.email).toBe(initialUserCreateRequest.email);
    });
});