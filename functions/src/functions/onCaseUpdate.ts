import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { isEqual } from 'lodash';
import { IFunctionsCaseCheckpoint } from '../models/caseCheckpoint';
import { Collections } from '../models/collections';

export const onCaseUpdateLocal = (passedInAdmin: admin.app.App) => functions.firestore
    .document(`${Collections.Project}/{projectId}`)
    .onUpdate(async(documentSnapshot, context) => {

        const projectId = context.params['projectId'];
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

        const currentDoctorCheckpointId = earliestDoctorCheckpoint ? earliestDoctorCheckpoint.linkedWorkflowCheckpointId : '';
        const currentDoctorCheckpointName = earliestDoctorCheckpoint ? earliestDoctorCheckpoint.name : '';

        const currentLabCheckpointId  = earliestLabCheckpoint ? earliestLabCheckpoint.linkedWorkflowCheckpointId : '';
        const currentLabCheckpointName = earliestLabCheckpoint ? earliestLabCheckpoint.name : '';

        const complete = afterCaseCheckpoints.every((caseCheckpoint) => {
            return caseCheckpoint.complete;
        });

        const hasStarted = afterCaseCheckpoints.some((caseCheckpoint) => {
            return caseCheckpoint.complete;
        });

        const firestore = passedInAdmin.firestore();

        await firestore.collection(Collections.Project).doc(projectId).set({
            currentDoctorCheckpointId,
            currentDoctorCheckpointName,
            currentLabCheckpointId,
            currentLabCheckpointName,
            complete,
            hasStarted,
        }, { merge: true });

        return true;
    })