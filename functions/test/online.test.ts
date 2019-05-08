import { generateUniqueId } from '../src/utils/generateUniqueId';

import * as functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import * as functionsTyping from 'firebase-functions';

import { createCase } from '../src';
import { WrappedFunction } from 'firebase-functions-test/lib/main';
import { IProjectCreateDataCloudFunctions } from '../src/models/projectCreateData';
import { UserType } from '../src/models/userTypes';

// Online Testing
const testEnv = functions({
    databaseURL: "https://shentaro-test.firebaseio.com",
    projectId: "shentaro-test",
    storageBucket: "gs://shentaro-test.appspot.com",
}, './service-account.json');

// Provide 3rd party API keys
// testEnv.mockConfig();

describe('createCase', () => {
    let companyId: string;
    let companyUserId: string;
    let firebaseAuthenticationUid: string;
    let companyUserJoinId: string;

    let caseCreateRequest: IProjectCreateDataCloudFunctions;
    let wrapped: WrappedFunction;

    beforeEach(() => {
        companyId = generateUniqueId();
        companyUserId = generateUniqueId();
        firebaseAuthenticationUid = generateUniqueId();
        companyUserJoinId = `${companyId}_${firebaseAuthenticationUid}`;

        caseCreateRequest = {
            id: generateUniqueId(),
            prescriptionFormTemplateId: generateUniqueId(),
            controlValues: {
                '1': '1234',
                '2': {
                    type: 'CaseDeadline',
                }
            },
            companyId,
        }
    });

    beforeAll(() => {
        wrapped = testEnv.wrap(createCase);
    })

    afterAll(() => {
        // testEnv.cleanup();
    });

    test('it does not allow case creation if the user does not exists on the company or is not active', async() => {
        let noCompanyUserJoinDocumentErrorMessage: string = '';
        try {
            await wrapped(caseCreateRequest, { auth: { uid: firebaseAuthenticationUid }});
        } catch (error) {
            const httpsError = error as functionsTyping.https.HttpsError;
            noCompanyUserJoinDocumentErrorMessage = httpsError.message;
        }

        expect(noCompanyUserJoinDocumentErrorMessage).toBe('The user does not exist on the company');

        const companyUserJoinData = {
            companyId,
            userId: companyUserId,
            firebaseAuthenticationUid,
        };

        await admin.firestore().collection('companyUserJoin').doc(companyUserJoinId).set(companyUserJoinData);

        let noCompanyUserErrorMessage: string = '';
        try {
            await wrapped(caseCreateRequest, { auth: { uid: firebaseAuthenticationUid }});
        } catch (error) {
            const httpsError = error as functionsTyping.https.HttpsError;
            noCompanyUserErrorMessage = httpsError.message;
        }

        expect(noCompanyUserErrorMessage).toBe('The user does not exist on the company');

        const companyUserData = {
            companyId,
            email: 'someone@gmail.com',
            fullName: 'Jane Doe',
            isActive: false,
            type: UserType.Admin,
            uid: firebaseAuthenticationUid,
        }

        await admin.firestore().collection('users').doc(companyUserId).set(companyUserData);

        let noActiveUserErrorMessage: string = '';
        try {
            await wrapped(caseCreateRequest, { auth: { uid: firebaseAuthenticationUid }});
        } catch (error) {
            const httpsError = error as functionsTyping.https.HttpsError;
            noActiveUserErrorMessage = httpsError.message;
        }

        expect(noActiveUserErrorMessage).toBe('The user is not active on the company');
    });
});
