import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Collections } from '../models/collections';

export const onChangeCompanyWorkflowLocal = (passedInAdmin: admin.app.App) => functions.firestore
    .document(`${Collections.CompanyWorkflow}/{companyWorkflowId}`)
    .onUpdate(async(documentSnapshot) => {
        const companyWorkflow = documentSnapshot.after.data();

        const workflowCheckpointsCount = companyWorkflow.workflowCheckpoints.length;

        await passedInAdmin.firestore().collection(Collections.Company)
            .doc(companyWorkflow.companyId)
            .set({
                workflowCheckpointsCount,
            }, { merge: true });
    });