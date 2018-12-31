import { IWorkflow, IWorkflowCheckpoint, IWorkflowCheckpointCreateRequest } from './../../Models/workflow';

export interface IWorkflowApi {
    getWorkflow(companyId: string): Promise<IWorkflow>;
    addWorkflowCheckpoint(companyId: string, workflowCheckpoint: IWorkflowCheckpointCreateRequest): Promise<IWorkflowCheckpoint>;
    removeWorkflowCheckpoint(companyId: string, workflowCheckpointId: string): Promise<void>;
    updateWorkflowCheckpoint(companyId: string, workflowCheckpoint: IWorkflowCheckpoint): Promise<IWorkflowCheckpoint>;
    updateWorkflowCheckpointOrder(companyId: string, newCheckpointOrder: string[]): Promise<void>;
}