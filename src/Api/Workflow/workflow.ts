import { IWorkflow } from './../../Models/workflow';
import { IWorkflowApi } from './workflowApiInterface';

export class WorkflowApi implements IWorkflowApi {
    public getWorkflow(companyName: string): IWorkflow {
        throw new Error("Method not implemented.");
    }

    public updateWorkflow(companyName: string, newWorkflow: IWorkflow): IWorkflow {
        throw new Error("Method not implemented.");
    }

}