import { IWorkflow } from './../../Models/workflow';

export interface IWorkflowApi {
    getWorkflow(companyName: string): IWorkflow;
    updateWorkflow(companyName: string, newWorkflow: IWorkflow): IWorkflow;
}