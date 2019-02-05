import { Timestamp } from '@google-cloud/firestore';

export interface IAugmentedCheckpoint {
    id: string;
    complete: boolean;
    completedDate: Timestamp | null;
    completedBy: string | null;
    linkedWorkflowCheckpoint: string;
    name: string;
    estimatedCompletionTime: string;
    visibleToDoctor: boolean;
}