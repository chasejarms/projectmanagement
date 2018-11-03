export interface IWorkflow {
    id: string;
    checkpoints: IWorkflowCheckpoint[];
}

export interface IWorkflowCheckpoint {
    name: string;
    estimatedCompletionTime: string;
    visibleToDoctor: boolean;
}