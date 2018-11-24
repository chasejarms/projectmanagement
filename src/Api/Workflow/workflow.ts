import { db } from './../../firebase';
import { IWorkflow } from './../../Models/workflow';
import { IWorkflowApi } from './workflowApiInterface';

export class WorkflowApi implements IWorkflowApi {
    public async getWorkflow(companyName: string): Promise<IWorkflow> {
        const companyDocumentSnapshot = await db.collection('companies')
            .doc(companyName)
            .get();

        return companyDocumentSnapshot.data()!.workflow;
    }

    public async updateWorkflow(companyName: string, newWorkflow: IWorkflow): Promise<void> {
        await db.collection('companies')
            .doc(companyName)
            .update({
                workflow: newWorkflow,
            });
    }

}