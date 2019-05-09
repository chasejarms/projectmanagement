import { Collections } from './../../../src/Models/collections';
import * as functionsTest from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { WrappedFunction } from 'firebase-functions-test/lib/main';
import { onCaseUpdate } from '../../src';
import { generateUniqueId } from '../../src/utils/generateUniqueId';
import { cloneDeep } from 'lodash';

const testEnv = functionsTest({
    databaseURL: "https://shentaro-test.firebaseio.com",
    projectId: "shentaro-test",
    storageBucket: "shentaro-test.appspot.com",
}, './service-account.json');

describe.only('onCaseUpdate', () => {
    let wrapped: WrappedFunction;
    let initialCaseId: string;
    let initialCaseSnapshot: any;
    let initialContext: any;

    beforeAll(() => {
        wrapped = testEnv.wrap(onCaseUpdate);
    });

    beforeEach(() => {
        initialCaseId = generateUniqueId();
        initialCaseSnapshot = {
            before: {
                data: () => ({
                    caseCheckpoints: [{
                        complete: true,
                        visibleToDoctor: true,
                    }],
                }),
            },
            after: {
                data: () => ({
                    caseCheckpoints: [
                        {
                            complete: true,
                            visibleToDoctor: true,
                        }
                    ],
                }),
            }
        }
        initialContext = { params: { caseId: initialCaseId }};
    });

    afterAll(() => {
        testEnv.cleanup();
    });

    test('it should short circuit if the checkpoint have not changed', async() => {
        const caseWasUpdated = await wrapped(initialCaseSnapshot, initialContext);
        expect(caseWasUpdated).toBe(false);
    });

    test('it should find the current doctor checkpoint id', async() => {
        const clonedCaseSnapshot = cloneDeep(initialCaseSnapshot);
        clonedCaseSnapshot.after.data = () => ({
            caseCheckpoints: [
                {
                    complete: true,
                    visibleToDoctor: true,
                    name: 'First Visible Doctor Checkpoint',
                    linkedWorkflowCheckpoint: '1',
                },
                {
                    complete: false,
                    visibleToDoctor: true,
                    name: 'Second Visible Doctor Checkpoint',
                    linkedWorkflowCheckpoint: '2',
                }
            ],
        })

        await wrapped(clonedCaseSnapshot, initialContext);

        const caseSnapshot = await admin.firestore().collection(Collections.Case)
            .doc(initialCaseId)
            .get();

        expect(caseSnapshot.data().currentDoctorCheckpoint).toBe('2');
    });

    test('it should find the earliest lab checkpoint', async() => {
        const clonedCaseSnapshot = cloneDeep(initialCaseSnapshot);
        clonedCaseSnapshot.after.data = () => ({
            caseCheckpoints: [
                {
                    complete: true,
                    visibleToDoctor: false,
                    name: 'First Lab Checkpoint',
                    linkedWorkflowCheckpoint: '1',
                },
                {
                    complete: false,
                    visibleToDoctor: false,
                    name: 'Second Lab Checkpoint',
                    linkedWorkflowCheckpoint: '2',
                }
            ],
        })

        await wrapped(clonedCaseSnapshot, initialContext);

        const caseSnapshot = await admin.firestore().collection(Collections.Case)
            .doc(initialCaseId)
            .get();

        expect(caseSnapshot.data().currentLabCheckpoint).toBe('2');
    });

    test('it should find the earliest doctor checkpoint name', async() => {
        const clonedCaseSnapshot = cloneDeep(initialCaseSnapshot);
        clonedCaseSnapshot.after.data = () => ({
            caseCheckpoints: [
                {
                    complete: true,
                    visibleToDoctor: true,
                    name: 'First Visible Doctor Checkpoint',
                    linkedWorkflowCheckpoint: '1',
                },
                {
                    complete: false,
                    visibleToDoctor: true,
                    name: 'Second Visible Doctor Checkpoint',
                    linkedWorkflowCheckpoint: '2',
                }
            ],
        })

        await wrapped(clonedCaseSnapshot, initialContext);

        const caseSnapshot = await admin.firestore().collection(Collections.Case)
            .doc(initialCaseId)
            .get();

        expect(caseSnapshot.data().currentDoctorCheckpointName).toBe('Second Visible Doctor Checkpoint');
    });

    test('it should find the earliest lab checkpoint name', async() => {
        const clonedCaseSnapshot = cloneDeep(initialCaseSnapshot);
        clonedCaseSnapshot.after.data = () => ({
            caseCheckpoints: [
                {
                    complete: true,
                    visibleToDoctor: true,
                    name: 'First Checkpoint',
                    linkedWorkflowCheckpoint: '1',
                },
                {
                    complete: false,
                    visibleToDoctor: true,
                    name: 'Second Checkpoint',
                    linkedWorkflowCheckpoint: '2',
                },
                {
                    complete: false,
                    visibleToDoctor: true,
                    name: 'Third Checkpoint',
                    linkedWorkflowCheckpoint: '3',
                }
            ],
        })

        await wrapped(clonedCaseSnapshot, initialContext);

        const caseSnapshot = await admin.firestore().collection(Collections.Case)
            .doc(initialCaseId)
            .get();

        expect(caseSnapshot.data().currentLabCheckpointName).toBe('Second Checkpoint');
    });

    test('it should set whether or not the case is complete', async() => {
        const clonedCaseSnapshot = cloneDeep(initialCaseSnapshot);
        clonedCaseSnapshot.after.data = () => ({
            caseCheckpoints: [
                {
                    complete: true,
                    visibleToDoctor: true,
                    name: 'First Checkpoint',
                    linkedWorkflowCheckpoint: '1',
                },
                {
                    complete: true,
                    visibleToDoctor: true,
                    name: 'Second Checkpoint',
                    linkedWorkflowCheckpoint: '2',
                },
                {
                    complete: true,
                    visibleToDoctor: true,
                    name: 'Third Checkpoint',
                    linkedWorkflowCheckpoint: '3',
                }
            ],
        })

        await wrapped(clonedCaseSnapshot, initialContext);

        const caseSnapshot = await admin.firestore().collection(Collections.Case)
            .doc(initialCaseId)
            .get();

        expect(caseSnapshot.data().complete).toBe(true);

        const clonedCaseSnapshotTwo = cloneDeep(initialCaseSnapshot);
        clonedCaseSnapshot.after.data = () => ({
            caseCheckpoints: [
                {
                    complete: true,
                    visibleToDoctor: true,
                    name: 'First Checkpoint',
                    linkedWorkflowCheckpoint: '1',
                },
                {
                    complete: false,
                    visibleToDoctor: true,
                    name: 'Second Checkpoint',
                    linkedWorkflowCheckpoint: '2',
                },
                {
                    complete: true,
                    visibleToDoctor: true,
                    name: 'Third Checkpoint',
                    linkedWorkflowCheckpoint: '3',
                }
            ],
        })

        await wrapped(clonedCaseSnapshot, initialContext);

        const caseSnapshotTwo = await admin.firestore().collection(Collections.Case)
            .doc(initialCaseId)
            .get();

        expect(caseSnapshotTwo.data().complete).toBe(false);
    });

    test('it should set whether or not the case is started', async() => {
        const clonedCaseSnapshot = cloneDeep(initialCaseSnapshot);
        clonedCaseSnapshot.after.data = () => ({
            caseCheckpoints: [
                {
                    complete: false,
                    visibleToDoctor: true,
                    name: 'First Checkpoint',
                    linkedWorkflowCheckpoint: '1',
                },
                {
                    complete: false,
                    visibleToDoctor: true,
                    name: 'Second Checkpoint',
                    linkedWorkflowCheckpoint: '2',
                },
                {
                    complete: false,
                    visibleToDoctor: true,
                    name: 'Third Checkpoint',
                    linkedWorkflowCheckpoint: '3',
                }
            ],
        })

        await wrapped(clonedCaseSnapshot, initialContext);

        const caseSnapshot = await admin.firestore().collection(Collections.Case)
            .doc(initialCaseId)
            .get();

        expect(caseSnapshot.data().hasStarted).toBe(false);

        const clonedCaseSnapshotTwo = cloneDeep(initialCaseSnapshot);
        clonedCaseSnapshot.after.data = () => ({
            caseCheckpoints: [
                {
                    complete: true,
                    visibleToDoctor: true,
                    name: 'First Checkpoint',
                    linkedWorkflowCheckpoint: '1',
                },
                {
                    complete: false,
                    visibleToDoctor: true,
                    name: 'Second Checkpoint',
                    linkedWorkflowCheckpoint: '2',
                },
                {
                    complete: false,
                    visibleToDoctor: true,
                    name: 'Third Checkpoint',
                    linkedWorkflowCheckpoint: '3',
                }
            ],
        })

        await wrapped(clonedCaseSnapshot, initialContext);

        const caseSnapshotTwo = await admin.firestore().collection(Collections.Case)
            .doc(initialCaseId)
            .get();

        expect(caseSnapshotTwo.data().hasStarted).toBe(true);
    });
});