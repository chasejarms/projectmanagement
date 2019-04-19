import { db } from './../../firebase';
import { ICheckpoint } from './../../Models/checkpoint';
import { IWorkflow } from './../../Models/workflow';
import { ICheckpointsApi } from './checkpointsInterface';

export class CheckpointsApi implements ICheckpointsApi {
    public async getCheckpointsForProjectCreation(companyName: string): Promise<ICheckpoint[]> {
        // tslint:disable-next-line:no-console
        console.log(companyName);
        const companyDocumentSnapshot = await db.collection('companies')
            .doc(companyName)
            .get()

        const baseWorkflow = companyDocumentSnapshot.data()!.workflow as IWorkflow;
        return baseWorkflow.map((workflowCheckpoint) => {
            return {
                ...workflowCheckpoint,
                complete: false,
                completedBy: null,
                completedByName: null,
            }
        });
    }
}