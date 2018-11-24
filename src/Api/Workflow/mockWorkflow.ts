import { workflow as mockWorkflow } from '../../MockData/workflow';
import { IWorkflow } from './../../Models/workflow';
import { mockApiKey } from './../mockApi.key';
import { IWorkflowApi } from './workflowApiInterface';

export const workflowKey = `${mockApiKey}workflow`;

export class MockWorkflowApi implements IWorkflowApi {
    constructor(defaultWorkflow?: boolean) {
        this.mockWorkflowSetup(defaultWorkflow);
    }

    public async getWorkflow(companyName: string): Promise<IWorkflow> {
        const stringifiedWorkflow = localStorage.getItem(workflowKey);
        const workflow = JSON.parse(stringifiedWorkflow!);
        return Promise.resolve(workflow);
    }

    public async updateWorkflow(companyName: string, newWorkflow: IWorkflow): Promise<IWorkflow> {
        const stringifiedWorkflow = JSON.stringify(newWorkflow);
        localStorage.setItem(workflowKey, stringifiedWorkflow);
        return Promise.resolve(newWorkflow);
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