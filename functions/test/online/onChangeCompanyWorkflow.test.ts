import * as functionsTest from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { WrappedFunction } from 'firebase-functions-test/lib/main';
import { onChangeCompanyWorkflow } from '../../src';
import { Collections } from '../../src/models/collections';
import { generateUniqueId } from '../../src/utils/generateUniqueId';

const testEnv = functionsTest({
    databaseURL: "https://shentaro-test.firebaseio.com",
    projectId: "shentaro-test",
    storageBucket: "shentaro-test.appspot.com",
}, './service-account.json');

describe('onChangeCompanyWorkflow', () => {
    let wrapped: WrappedFunction;
    let companyId: string;

    beforeEach(() => {
        companyId = generateUniqueId();
    })

    beforeAll(() => {
        wrapped = testEnv.wrap(onChangeCompanyWorkflow);
    })

    afterAll(() => {
        testEnv.cleanup();
    });

    test('it should set the workflow checkpoints count on the company doc', async() => {
        const companyPromise = admin.firestore().collection(Collections.Company)
            .doc(companyId)
            .set({
                workflowCheckpointsCount: 0,
            });

        const companyWorkflowId = generateUniqueId();
        const companyWorkflowPromise = admin.firestore().collection(Collections.CompanyWorkflow)
            .doc(companyWorkflowId)
            .set({
                companyId,
                workflowCheckpoints: [],
            })

        await Promise.all([
            companyPromise,
            companyWorkflowPromise,
        ]);

        await wrapped({
            after: {
                data: () => ({
                    companyId,
                    workflowCheckpoints: [
                        {},
                        {},
                        {},
                    ],
                })
            },
        });

        const updatedCompanySnapshot = await admin.firestore().collection(Collections.Company)
            .doc(companyId)
            .get();

        expect(updatedCompanySnapshot.data().workflowCheckpointsCount).toBe(3);
    });
});
