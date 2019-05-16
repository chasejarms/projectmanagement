import * as admin from 'firebase-admin';

export interface IFunctionsCaseCheckpoint {
    complete: boolean;
    completedByCompanyUserId: string | null;
    completedTimestamp: admin.firestore.Timestamp | null;
    completedByName: string | null;
    linkedWorkflowCheckpointId: string;
    estimatedCompletionTime: string;
    name: string;
    visibleToDoctor: boolean;
}