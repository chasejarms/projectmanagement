import * as admin from 'firebase-admin';

export interface IFunctionsCaseCheckpoint {
    id: string;
    complete: boolean;
    completedDate: admin.firestore.Timestamp | null;
    completedBy: string | null;
    linkedWorkflowCheckpoint: string;
}