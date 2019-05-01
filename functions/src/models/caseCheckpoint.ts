import * as admin from 'firebase-admin';

export interface IFunctionsCaseCheckpoint {
    complete: boolean;
    completedBy: string | null;
    completedDate: admin.firestore.Timestamp | null;
    completedByName: string | null;
    linkedWorkflowCheckpoint: string;
    estimatedCompletionTime: string;
    name: string;
    visibleToDoctor: boolean;
}