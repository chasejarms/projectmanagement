export interface IWorkflow {
    companyId: string;
    workflowCheckpointIds: string[];
    name: string;
    id: string;
}

export interface IWorkflowCheckpoint extends IWorkflowCheckpointCreateRequest {
    id: string;
}

export interface IWorkflowCheckpointCreateRequest {
    name: string;
    estimatedCompletionTime: string;
    visibleToDoctor: boolean;
}