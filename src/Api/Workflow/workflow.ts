import { IWorkflow } from './../../Models/workflow';
import { IWorkflowApi } from './workflowApiInterface';

export class WorkflowApi implements IWorkflowApi {
    public getWorkflow(companyName: string): Promise<IWorkflow> {
        throw new Error("Method not implemented.");
    }

    public updateWorkflow(companyName: string, newWorkflow: IWorkflow): Promise<IWorkflow> {
        throw new Error("Method not implemented.");
    }

}