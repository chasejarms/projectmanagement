export interface IAugmentedCheckpoint {
    complete: boolean;
    completedDate: Date | null;
    completedBy: string | null;
    linkedWorkflowCheckpoint: string;
    name: string;
    estimatedCompletionTime: string;
    visibleToDoctor: boolean;
}