import { Timestamp } from "@google-cloud/firestore";

export interface ICaseCheckpoint {
    complete: boolean;
    completedDate: Timestamp | null;
    completedBy: string | null;
    linkedWorkflowCheckpoint: string;
}