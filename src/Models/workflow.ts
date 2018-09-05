export interface IWorkflow {
    id: string;
    checkpoints: IWorkflowCheckpoint[];
}

export interface IWorkflowCheckpoint {
    name: string;
    description?: string;
    deadlineFromLastCheckpoint?: number;
    publicCheckpoint: boolean;
}