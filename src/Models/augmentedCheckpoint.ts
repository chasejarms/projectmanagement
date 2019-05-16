import { Timestamp } from '@google-cloud/firestore';

export interface IAugmentedCheckpoint {
    id: string;
    complete: boolean;
    completedTimestamp: Timestamp | null;
    completedByCompanyUserId: string | null;
    completedByName: string | null;
    linkedWorkflowCheckpointId: string;
    name: string;
    estimatedCompletionTime: string;
    visibleToDoctor: boolean;
}