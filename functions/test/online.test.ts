import { ShowNewInfoFromType } from './../../src/Models/showNewInfoFromTypes';
import { generateUniqueId } from '../src/utils/generateUniqueId';

import * as functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import * as functionsTyping from 'firebase-functions';

import { createCase } from '../src';
import { WrappedFunction } from 'firebase-functions-test/lib/main';
import { IProjectCreateDataCloudFunctions } from '../src/models/projectCreateData';
import { UserType } from '../src/models/userTypes';

import { cloneDeep } from 'lodash';
import { Collections } from '../src/models/collections';

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

    let doctorCompanyUserId: string;
    let doctorFirebaseAuthenticationUid: string;

    let initialCaseCreateRequest: IProjectCreateDataCloudFunctions;
    let wrapped: WrappedFunction;

    let caseId: string;

    beforeEach(() => {
        companyId = generateUniqueId();
        companyUserId = generateUniqueId();
        firebaseAuthenticationUid = generateUniqueId();
        companyUserJoinId = `${companyId}_${firebaseAuthenticationUid}`;

        doctorCompanyUserId = generateUniqueId();
        doctorFirebaseAuthenticationUid = generateUniqueId();

        caseId = generateUniqueId();

        initialCaseCreateRequest = {
            id: caseId,
            prescriptionFormTemplateId: generateUniqueId(),
            controlValues: {},
            companyId,
        }
    });

    beforeAll(() => {
        wrapped = testEnv.wrap(createCase);
    })

    afterAll(() => {
        testEnv.cleanup();
    });

    test('it does not allow case creation if the user does not exists on the company or is not active', async() => {
        let noCompanyUserJoinDocumentErrorMessage: string = '';
        try {
            await wrapped(initialCaseCreateRequest, { auth: { uid: firebaseAuthenticationUid }});
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

        await admin.firestore().collection(Collections.CompanyAuthUserJoin).doc(companyUserJoinId).set(companyUserJoinData);

        let noCompanyUserErrorMessage: string = '';
        try {
            await wrapped(initialCaseCreateRequest, { auth: { uid: firebaseAuthenticationUid }});
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

        await admin.firestore().collection(Collections.CompanyUser).doc(companyUserId).set(companyUserData);

        let noActiveUserErrorMessage: string = '';
        try {
            await wrapped(initialCaseCreateRequest, { auth: { uid: firebaseAuthenticationUid }});
        } catch (error) {
            const httpsError = error as functionsTyping.https.HttpsError;
            noActiveUserErrorMessage = httpsError.message;
        }

        expect(noActiveUserErrorMessage).toBe('The user is not active on the company');
    });

    test('it does not allow case creation if the prescription template does not exist', async() => {
        const companyUserJoinData = {
            companyId,
            userId: companyUserId,
            firebaseAuthenticationUid,
        };

        await admin.firestore().collection(Collections.CompanyAuthUserJoin).doc(companyUserJoinId).set(companyUserJoinData);

        const companyUserData = {
            companyId,
            email: 'someone@gmail.com',
            fullName: 'Jane Doe',
            isActive: true,
            type: UserType.Admin,
            uid: firebaseAuthenticationUid,
        }

        await admin.firestore().collection(Collections.CompanyUser).doc(companyUserId).set(companyUserData);
        await admin.firestore().collection(Collections.CompanyWorkflow).add({
            companyId,
            prescriptionTemplate: '123',
            workflowCheckpoints: [],
        })

        let noPrescriptionTemplateError: string = '';
        try {
            await wrapped(initialCaseCreateRequest, { auth: { uid: firebaseAuthenticationUid }});
        } catch (error) {
            const httpsError = error as functionsTyping.https.HttpsError;
            noPrescriptionTemplateError = httpsError.message;
        }

        expect(noPrescriptionTemplateError).toBe('The prescription template does not exist');
    });

    test('it does not allow case creation if there is no case deadline or no doctor', async() => {
        const companyUserJoinData = {
            companyId,
            userId: companyUserId,
            firebaseAuthenticationUid,
        };

        await admin.firestore().collection(Collections.CompanyAuthUserJoin).doc(companyUserJoinId).set(companyUserJoinData);

        const companyUserData = {
            companyId,
            email: 'someone@gmail.com',
            fullName: 'Jane Doe',
            isActive: true,
            type: UserType.Admin,
            uid: firebaseAuthenticationUid,
        }

        await admin.firestore().collection(Collections.CompanyUser).doc(companyUserId).set(companyUserData);
        const prescriptionTemplateId = generateUniqueId();
        await admin.firestore().collection(Collections.CompanyWorkflow).add({
            companyId,
            prescriptionTemplate: prescriptionTemplateId,
            workflowCheckpoints: [],
        })

        const sectionId = '1';
        const caseDeadlineControlId = '2';
        const doctorInformationControlId = '3';

        await admin.firestore().collection(Collections.PrescriptionTemplate).doc(prescriptionTemplateId).set({
            sectionOrder: [sectionId],
            sections: {
                [sectionId]: {
                    controlOrder: [caseDeadlineControlId],
                }
            },
            controls: {
                [caseDeadlineControlId]: {
                    type: 'CaseDeadline',
                    id: caseDeadlineControlId,
                }
            }
        });

        const firstCaseCreateRequest = cloneDeep(initialCaseCreateRequest);
        firstCaseCreateRequest.controlValues = {
            [caseDeadlineControlId]: {
                seconds: 0,
                nanoseconds: 0,
            }
        }

        let noDoctorInformationError: string = '';
        try {
            await wrapped(firstCaseCreateRequest, { auth: { uid: firebaseAuthenticationUid }});
        } catch (error) {
            const httpsError = error as functionsTyping.https.HttpsError;
            noDoctorInformationError = httpsError.message;
        }

        expect(noDoctorInformationError).toBe('The case requires a doctor information field');

        await admin.firestore().collection(Collections.PrescriptionTemplate).doc(prescriptionTemplateId).set({
            sectionOrder: [sectionId],
            sections: {
                [sectionId]: {
                    controlOrder: [doctorInformationControlId],
                }
            },
            controls: {
                [doctorInformationControlId]: {
                    type: 'DoctorInformation',
                    id: doctorInformationControlId,
                }
            }
        });

        const secondCaseCreationRequest = cloneDeep(initialCaseCreateRequest);
        secondCaseCreationRequest.controlValues = {
            [doctorInformationControlId]: '1',
        }

        let noCaseDeadlineError: string = '';
        try {
            await wrapped(secondCaseCreationRequest, { auth: { uid: firebaseAuthenticationUid }});
        } catch (error) {
            const httpsError = error as functionsTyping.https.HttpsError;
            noCaseDeadlineError = httpsError.message;
        }

        expect(noCaseDeadlineError).toBe('The case requires a case deadline field');
    });

    test('does not allow case creation if the specified doctor does not exist or is not active on the company', async() => {
        const companyUserJoinData = {
            companyId,
            userId: companyUserId,
            firebaseAuthenticationUid,
        };

        await admin.firestore().collection(Collections.CompanyAuthUserJoin).doc(companyUserJoinId).set(companyUserJoinData);

        const companyUserData = {
            companyId,
            email: 'someone@gmail.com',
            fullName: 'Jane Doe',
            isActive: true,
            type: UserType.Admin,
            uid: firebaseAuthenticationUid,
        }

        await admin.firestore().collection(Collections.CompanyUser).doc(companyUserId).set(companyUserData);

        const firstWorkflowCheckpointId = generateUniqueId();
        const secondWorkflowCheckpointId = generateUniqueId();
        await admin.firestore().collection(Collections.WorkflowCheckpoint).doc(firstWorkflowCheckpointId).set({
            linkedWorkflowCheckpoint: '2',
            name: 'First Actual Checkpoint',
            visibleToDoctor: false,
        });

        await admin.firestore().collection(Collections.WorkflowCheckpoint).doc(secondWorkflowCheckpointId).set({
            linkedWorkflowCheckpoint: '1',
            name: 'First Doctor Checkpoint',
            visibleToDoctor: true
        });

        const prescriptionTemplateId = generateUniqueId();
        await admin.firestore().collection(Collections.CompanyWorkflow).add({
            companyId,
            prescriptionTemplate: prescriptionTemplateId,
            workflowCheckpoints: [firstWorkflowCheckpointId, secondWorkflowCheckpointId],
        });

        const sectionId = '1';
        const caseDeadlineControlId = '2';
        const doctorInformationControlId = '3';

        await admin.firestore().collection(Collections.PrescriptionTemplate).doc(prescriptionTemplateId).set({
            sectionOrder: [sectionId],
            sections: {
                [sectionId]: {
                    controlOrder: [caseDeadlineControlId, doctorInformationControlId],
                }
            },
            controls: {
                [caseDeadlineControlId]: {
                    type: 'CaseDeadline',
                    id: caseDeadlineControlId,
                },
                [doctorInformationControlId]: {
                    type: 'DoctorInformation',
                    id: doctorInformationControlId,
                },
            }
        });

        const caseCreationRequest = cloneDeep(initialCaseCreateRequest);
        caseCreationRequest.controlValues = {
            [doctorInformationControlId]: '1',
            [caseDeadlineControlId]: {
                seconds: 0,
                nanoseconds: 0,
            }
        }

        let noDoctorError: string = '';
        try {
            await wrapped(caseCreationRequest, { auth: { uid: firebaseAuthenticationUid }});
        } catch (error) {
            const httpsError = error as functionsTyping.https.HttpsError;
            noDoctorError = httpsError.message;
        }

        expect(noDoctorError).toBe('The specified doctor does not exist on the company');

        const doctorCompanyUserData = {
            companyId,
            email: 'doctor@doctorjohnson.com',
            fullName: 'Doctor Johnson',
            isActive: false,
            type: UserType.Doctor,
            uid: doctorFirebaseAuthenticationUid,
        }

        await admin.firestore().collection(Collections.CompanyUser).doc(doctorCompanyUserId).set(doctorCompanyUserData);

        const caseCreationRequestTwo = cloneDeep(initialCaseCreateRequest);
        caseCreationRequestTwo.controlValues = {
            [doctorInformationControlId]: doctorCompanyUserId,
            [caseDeadlineControlId]: {
                seconds: 0,
                nanoseconds: 0,
            }
        }

        let doctorIsInactiveError: string = '';
        try {
            await wrapped(caseCreationRequestTwo, { auth: { uid: firebaseAuthenticationUid }});
        } catch (error) {
            const httpsError = error as functionsTyping.https.HttpsError;
            doctorIsInactiveError = httpsError.message;
        }

        expect(doctorIsInactiveError).toBe('The specified doctor is not active on the company');
    });

    test('it should hoist / set the top level information', async() => {
        const companyUserJoinData = {
            companyId,
            userId: companyUserId,
            firebaseAuthenticationUid,
        };

        await admin.firestore().collection(Collections.CompanyAuthUserJoin).doc(companyUserJoinId).set(companyUserJoinData);

        const companyUserData = {
            companyId,
            email: 'someone@gmail.com',
            fullName: 'Jane Doe',
            isActive: true,
            type: UserType.Admin,
            uid: firebaseAuthenticationUid,
        }

        await admin.firestore().collection(Collections.CompanyUser).doc(companyUserId).set(companyUserData);

        const doctorCompanyUserData = {
            companyId,
            email: 'doctor@doctorjohnson.com',
            fullName: 'Doctor Johnson',
            isActive: true,
            type: UserType.Doctor,
            uid: doctorFirebaseAuthenticationUid,
        }

        await admin.firestore().collection(Collections.CompanyUser).doc(doctorCompanyUserId).set(doctorCompanyUserData);

        const firstWorkflowCheckpointId = generateUniqueId();
        const secondWorkflowCheckpointId = generateUniqueId();
        await admin.firestore().collection(Collections.WorkflowCheckpoint).doc(firstWorkflowCheckpointId).set({
            linkedWorkflowCheckpoint: '2',
            name: 'First Actual Checkpoint',
            visibleToDoctor: false,
        });

        await admin.firestore().collection(Collections.WorkflowCheckpoint).doc(secondWorkflowCheckpointId).set({
            linkedWorkflowCheckpoint: '1',
            name: 'First Doctor Checkpoint',
            visibleToDoctor: true
        });

        const prescriptionTemplateId = generateUniqueId();
        await admin.firestore().collection(Collections.CompanyWorkflow).add({
            companyId,
            prescriptionTemplate: prescriptionTemplateId,
            workflowCheckpoints: [firstWorkflowCheckpointId, secondWorkflowCheckpointId],
        });

        const sectionId = '1';
        const caseDeadlineControlId = '2';
        const doctorInformationControlId = '3';

        await admin.firestore().collection(Collections.PrescriptionTemplate).doc(prescriptionTemplateId).set({
            sectionOrder: [sectionId],
            sections: {
                [sectionId]: {
                    controlOrder: [caseDeadlineControlId, doctorInformationControlId],
                }
            },
            controls: {
                [caseDeadlineControlId]: {
                    type: 'CaseDeadline',
                    id: caseDeadlineControlId,
                },
                [doctorInformationControlId]: {
                    type: 'DoctorInformation',
                    id: doctorInformationControlId,
                },
            }
        });

        const caseCreationRequest = cloneDeep(initialCaseCreateRequest);
        caseCreationRequest.controlValues = {
            [doctorInformationControlId]: doctorCompanyUserId,
            [caseDeadlineControlId]: {
                seconds: 0,
                nanoseconds: 0,
            }
        }

        await wrapped(caseCreationRequest, { auth: { uid: firebaseAuthenticationUid }});

        const caseSnapshot = await admin.firestore().collection(Collections.Case).doc(caseId).get();
        const {
            complete,
            deadline,
            doctor,
            created,
            showNewInfoFrom,
            hasStarted,
            currentDoctorCheckpoint,
            currentDoctorCheckpointName,
            currentLabCheckpointName,
            currentLabCheckpoint,
            doctorName,
        } = caseSnapshot.data();

        expect(complete).toBe(false);
        expect(deadline).toBeDefined();
        expect(doctor).toBe(doctorCompanyUserId);
        expect(created).toBeDefined();
        expect(showNewInfoFrom).toBe(ShowNewInfoFromType.Lab);
        expect(hasStarted).toBe(false);
        expect(currentDoctorCheckpoint).toBe(secondWorkflowCheckpointId);
        expect(currentDoctorCheckpointName).toBe('First Doctor Checkpoint');
        expect(currentLabCheckpoint).toBe(firstWorkflowCheckpointId);
        expect(currentLabCheckpointName).toBe('First Actual Checkpoint');
        expect(doctorName).toBe('Doctor Johnson');
    });
});
