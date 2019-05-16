import { firestore } from 'firebase';

export interface ICaseCheckpoint {
    complete: boolean;
    completedByCompanyUserId: string | null;
    completedTimestamp: firestore.Timestamp | null;
    completedByName: string | null;
    linkedWorkflowCheckpointId: string;
    estimatedCompletionTime: string;
    name: string;
    visibleToDoctor: boolean;
}