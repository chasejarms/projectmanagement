import { IWorkflow } from './../../Models/workflow';

export interface IWorkflowApi {
    getWorkflow(companyName: string): Promise<IWorkflow>;
    updateWorkflow(companyName: string, newWorkflow: IWorkflow): Promise<void>;
}