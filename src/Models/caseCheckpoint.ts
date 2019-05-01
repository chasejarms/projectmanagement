import { firestore } from 'firebase';

export interface ICaseCheckpoint {
    complete: boolean;
    completedBy: string | null;
    completedDate: firestore.Timestamp | null;
    completedByName: string | null;
    linkedWorkflowCheckpoint: string;
    estimatedCompletionTime: string;
    name: string;
    visibleToDoctor: boolean;
}