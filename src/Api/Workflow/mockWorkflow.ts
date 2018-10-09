import { workflow as mockWorkflow } from '../../MockData/workflow';
import { IWorkflow } from './../../Models/workflow';
import { mockApiKey } from './../mockApi.key';
import { IWorkflowApi } from './workflowApiInterface';

export const workflowKey = `${mockApiKey}workflow`;

export class MockWorkflowApi implements IWorkflowApi {
    constructor(defaultWorkflow?: boolean) {
        const workflow = this.getWorkflow('does not matter');
        const workflowAlreadyExists = !!workflow && !!workflow.checkpoints && !!workflow.checkpoints.length;
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

    public getWorkflow(companyName: string): IWorkflow {
        const stringifiedWorkflow = localStorage.getItem(workflowKey);
        const workflow = JSON.parse(stringifiedWorkflow!);
        return workflow;
    }

    public updateWorkflow(companyName: string, newWorkflow: IWorkflow): IWorkflow {
        const { id } = this.getWorkflow(companyName);
        const stringifiedWorkflow = JSON.stringify({
            ...newWorkflow,
            id,
        });
        localStorage.setItem(workflowKey, stringifiedWorkflow);
        return newWorkflow;
    }

}