import * as functionsTest from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { WrappedFunction } from 'firebase-functions-test/lib/main';
import { onChangePrescriptionTemplate } from '../../src';
import { Collections } from '../../src/models/collections';
import { generateUniqueId } from '../../src/utils/generateUniqueId';

const testEnv = functionsTest({
    databaseURL: "https://shentaro-test.firebaseio.com",
    projectId: "shentaro-test",
    storageBucket: "shentaro-test.appspot.com",
}, './service-account.json');

describe('onChangePrescriptionTemplate', () => {
    let wrapped: WrappedFunction;
    let companyId: string;

    beforeEach(() => {
        companyId = generateUniqueId();
    })

    beforeAll(() => {
        wrapped = testEnv.wrap(onChangePrescriptionTemplate);
    })

    afterAll(() => {
        testEnv.cleanup();
    });

    test('it should set the prescription template flag to false if the doctor information is missing', async() => {
        await admin.firestore().collection(Collections.Company)
            .doc(companyId)
            .set({
                prescriptionTemplateHasSufficientFields: true,
            });

        await wrapped({
            data: () => ({
                sectionOrder: ['1'],
                sections: {
                    1: {
                        controlOrder: ['1'],
                    }
                },
                controls: {
                    1: {
                        type: 'CaseDeadline',
                    },
                }
            })
        })

        const companyDocumentSnapshot = await admin.firestore().collection(Collections.Company)
            .doc(companyId)
            .get();

        expect(companyDocumentSnapshot.data().prescriptionTemplateHasSufficientFields).toBe(false);
    });

    test('it should set the prescription template flag to false if the case deadline is missing', async() => {
        await admin.firestore().collection(Collections.Company)
            .doc(companyId)
            .set({
                prescriptionTemplateHasSufficientFields: true,
            });

        await wrapped({
            data: () => ({
                sectionOrder: ['1'],
                sections: {
                    1: {
                        controlOrder: ['1'],
                    }
                },
                controls: {
                    1: {
                        type: 'DoctorInformation',
                    },
                }
            })
        })

        const companyDocumentSnapshot = await admin.firestore().collection(Collections.Company)
            .doc(companyId)
            .get();

        expect(companyDocumentSnapshot.data().prescriptionTemplateHasSufficientFields).toBe(false);
    });

    test('it should set the prescription template flag to true if the doctor information and case deadaline are present', async() => {
        await admin.firestore().collection(Collections.Company)
            .doc(companyId)
            .set({
                prescriptionTemplateHasSufficientFields: false,
            });

        await wrapped({
            data: () => ({
                sectionOrder: ['1'],
                sections: {
                    1: {
                        controlOrder: ['1', '2'],
                    }
                },
                controls: {
                    1: {
                        type: 'DoctorInformation',
                    },
                    2: {
                        type: 'CaseDeadline',
                    }
                }
            })
        })

        const companyDocumentSnapshot = await admin.firestore().collection(Collections.Company)
            .doc(companyId)
            .get();

        expect(companyDocumentSnapshot.data().prescriptionTemplateHasSufficientFields).toBe(true);
    });
});
