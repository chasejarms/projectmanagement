import { IWorkflow } from './../../Models/workflow';

export interface IWorkflowApi {
    getWorkflow(companyId: string): Promise<IWorkflow>;
    updateWorkflow(companyName: string, newWorkflow: IWorkflow): Promise<void>;
}