export type IWorkflow = IWorkflowCheckpoint[];

export interface IWorkflowCheckpoint {
    name: string;
    estimatedCompletionTime: string;
    visibleToDoctor: boolean;
}