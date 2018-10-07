import { ICheckpoint } from './../../Models/checkpoint';
import { IWorkflowApi } from './../Workflow/workflowApiInterface';
import { ICheckpointsApi } from './checkpointsInterface';

export class MockCheckpointsApi implements ICheckpointsApi {
    constructor(public workflowApi?: IWorkflowApi) {}

    public getCheckpointsForProjectCreation(companyName: string): ICheckpoint[] {
        const workflow = this.workflowApi!.getWorkflow(companyName);
        let previousCheckpointDeadine: Date = new Date();

        const initialCheckpoints: ICheckpoint[] = workflow.checkpoints.map((workflowCheckpoint, index) => {
            const currentCheckpointDeadline = this.checkpointDeadline(previousCheckpointDeadine, workflowCheckpoint.deadlineFromLastCheckpoint);

            const checkpoint: ICheckpoint = {
                name: workflowCheckpoint.name,
                description: workflowCheckpoint.description,
                complete: false,
                projectId: '1',
                id: '1',
                deadline: currentCheckpointDeadline,
            };

            previousCheckpointDeadine = currentCheckpointDeadline;

            return checkpoint;
        });
        return initialCheckpoints;
    }

    private checkpointDeadline(previousCheckpointDeadline: Date, days: number): Date {
        const previousCheckpointClone = new Date(previousCheckpointDeadline);
        previousCheckpointClone.setDate(previousCheckpointClone.getDate() + Number(days));
        return previousCheckpointClone;
    }
}