import { db } from './../../firebase';
import { IWorkflow, IWorkflowCheckpoint } from './../../Models/workflow';
import { IWorkflowApi } from './workflowApiInterface';

export class WorkflowApi implements IWorkflowApi {
    public async getWorkflow(companyId: string): Promise<IWorkflow> {
        const workflowDocumentSnapshot = await db.collection('companyWorkflows')
            .where('companyId', '==', companyId)
            .get();

        const workflowCheckpoints = workflowDocumentSnapshot.docs[0].data().workflowCheckpoints;
        const workflowCheckpointDocumentSnapshots = await Promise.all(workflowCheckpoints.map((workflowCheckpointId: string) => {
            return db.collection('workflowCheckpoints').doc(workflowCheckpointId).get();
        }));

        const fullWorkflowCheckpoints = workflowCheckpointDocumentSnapshots.map((workflowCheckpointDocumentSnapshot: firebase.firestore.DocumentSnapshot) => {
            return workflowCheckpointDocumentSnapshot.data() as IWorkflowCheckpoint;
        });

        return fullWorkflowCheckpoints;
    }

    public async updateWorkflow(companyName: string, newWorkflow: IWorkflow): Promise<void> {
        await db.collection('companies')
            .doc(companyName)
            .update({
                workflow: newWorkflow,
            });
    }

}