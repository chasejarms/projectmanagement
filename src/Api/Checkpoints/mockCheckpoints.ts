import { ICheckpoint } from './../../Models/checkpoint';
import { IWorkflowApi } from './../Workflow/workflowApiInterface';
import { ICheckpointsApi } from './checkpointsInterface';

export class MockCheckpointsApi implements ICheckpointsApi {
    constructor(public workflowApi?: IWorkflowApi) {}

    public async getCheckpointsForProjectCreation(companyName: string): Promise<ICheckpoint[]> {
        const workflow = await this.workflowApi!.getWorkflow(companyName);

        const initialCheckpoints: ICheckpoint[] = workflow.map((workflowCheckpoint, index) => {

            const checkpoint: ICheckpoint = {
                id: '',
                name: workflowCheckpoint.name,
                estimatedCompletionTime: '1 days',
                visibleToDoctor: true,
                complete: false,
                completedBy: null,
            };

            return checkpoint;
        });
        return initialCheckpoints;
    }
}