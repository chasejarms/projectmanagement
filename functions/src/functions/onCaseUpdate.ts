import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { isEqual } from 'lodash';
import { IFunctionsCaseCheckpoint } from '../models/caseCheckpoint';
import { Collections } from '../models/collections';

export const onCaseUpdateLocal = (passedInAdmin: admin.app.App) => functions.firestore
    .document(`${Collections.Case}/{caseId}`)
    .onUpdate(async(documentSnapshot, context) => {

        const caseId = context.params['caseId'];
        const beforeCaseCheckpoints = documentSnapshot.before.data().caseCheckpoints as IFunctionsCaseCheckpoint[];
        const afterCaseCheckpoints = documentSnapshot.after.data().caseCheckpoints as IFunctionsCaseCheckpoint[];

        const noCheckpointsHaveChanged = isEqual(beforeCaseCheckpoints, afterCaseCheckpoints);

        if (noCheckpointsHaveChanged) {
            return false;
        }

        const earliestDoctorCheckpoint = afterCaseCheckpoints.find((caseCheckpoint) => {
            return caseCheckpoint.visibleToDoctor && !caseCheckpoint.complete;
        });

        const earliestLabCheckpoint = afterCaseCheckpoints.find((caseCheckpoint) => {
            return !caseCheckpoint.complete;
        });

        const currentDoctorCheckpointId = earliestDoctorCheckpoint ? earliestDoctorCheckpoint.linkedWorkflowCheckpoint : '';
        const currentDoctorCheckpointName = earliestDoctorCheckpoint ? earliestDoctorCheckpoint.name : '';

        const currentLabCheckpointId  = earliestLabCheckpoint ? earliestLabCheckpoint.linkedWorkflowCheckpoint : '';
        const currentLabCheckpointName = earliestLabCheckpoint ? earliestLabCheckpoint.name : '';

        const complete = afterCaseCheckpoints.every((caseCheckpoint) => {
            return caseCheckpoint.complete;
        });

        const hasStarted = afterCaseCheckpoints.some((caseCheckpoint) => {
            return caseCheckpoint.complete;
        });

        const firestore = passedInAdmin.firestore();

        await firestore.collection(Collections.Case).doc(caseId).set({
            currentDoctorCheckpointId,
            currentDoctorCheckpointName,
            currentLabCheckpointId,
            currentLabCheckpointName,
            complete,
            hasStarted,
        }, { merge: true });

        return true;
    })