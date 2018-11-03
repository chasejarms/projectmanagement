import { ICheckpoint } from './../../Models/checkpoint';
import { IWorkflowApi } from './../Workflow/workflowApiInterface';
import { ICheckpointsApi } from './checkpointsInterface';

export class MockCheckpointsApi implements ICheckpointsApi {
    constructor(public workflowApi?: IWorkflowApi) {}

    public getCheckpointsForProjectCreation(companyName: string): ICheckpoint[] {
        const workflow = this.workflowApi!.getWorkflow(companyName);

        const initialCheckpoints: ICheckpoint[] = workflow.checkpoints.map((workflowCheckpoint, index) => {

            const checkpoint: ICheckpoint = {
                name: workflowCheckpoint.name,
                estimatedTimeframe: '1 days',
                visibleToCustomer: true,
                complete: false,
                projectId: '1',
                id: '1',
            };

            return checkpoint;
        });
        return initialCheckpoints;
    }
}