import { workflow as mockWorkflow } from '../../MockData/workflow';
import { IWorkflow, IWorkflowCheckpoint, IWorkflowCheckpointCreateRequest } from './../../Models/workflow';
import { mockApiKey } from './../mockApi.key';
import { IWorkflowApi } from './workflowApiInterface';

export const workflowKey = `${mockApiKey}workflow`;

export class MockWorkflowApi implements IWorkflowApi {
    constructor(defaultWorkflow?: boolean) {
        this.mockWorkflowSetup(defaultWorkflow);
    }

    public async getWorkflow(companyId: string): Promise<IWorkflow> {
        const stringifiedWorkflow = localStorage.getItem(workflowKey);
        const workflow = JSON.parse(stringifiedWorkflow!);
        return Promise.resolve(workflow);
    }

    public addWorkflowCheckpoint(companyId: string, workflowCheckpoint: IWorkflowCheckpointCreateRequest): Promise<IWorkflowCheckpoint> {
        throw new Error("Method not implemented.");
    }

    public removeWorkflowCheckpoint(companyId: string, workflowCheckpointId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public updateWorkflowCheckpoint(companyId: string, workflowCheckpoint: IWorkflowCheckpoint): Promise<IWorkflowCheckpoint> {
        throw new Error("Method not implemented.");
    }

    public updateWorkflowCheckpointOrder(companyId: string, newCheckpointOrder: string[]): Promise<void> {
        throw new Error("Method not implemented");
    }

    private async mockWorkflowSetup(defaultWorkflow?: boolean): Promise<void> {
        const workflow = await this.getWorkflow('does not matter');
        const workflowAlreadyExists = !!workflow && !!workflow.length;
        if (defaultWorkflow && !workflowAlreadyExists) {
            localStorage.setItem(
                workflowKey,
                JSON.stringify({
                    ...mockWorkflow,
                    id: Date.now().toString(),
                }),
            )
        } else if (!defaultWorkflow && !workflowAlreadyExists) {
            localStorage.setItem(
                workflowKey,
                JSON.stringify({
                    id: Date.now().toString(),
                    checkpoints: [],
                })
            )
        }
    }

}