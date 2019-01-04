export interface ICaseCheckpoint {
    complete: boolean;
    completedDate: Date | null;
    completedBy: string | null;
    linkedWorkflowCheckpoint: string;
}