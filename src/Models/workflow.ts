export type IWorkflow = IWorkflowCheckpoint[];

export interface IWorkflowCheckpoint extends IWorkflowCheckpointCreateRequest {
    id: string;
}

export interface IWorkflowCheckpointCreateRequest {
    name: string;
    estimatedCompletionTime: string;
    visibleToDoctor: boolean;
}