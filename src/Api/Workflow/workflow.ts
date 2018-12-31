import { db } from './../../firebase';
import { IWorkflow, IWorkflowCheckpoint, IWorkflowCheckpointCreateRequest } from './../../Models/workflow';
import { IWorkflowApi } from './workflowApiInterface';

export class WorkflowApi implements IWorkflowApi {
    public async getWorkflow(companyId: string): Promise<IWorkflow> {
        const workflowDocumentSnapshot = await this.getWorkflowDocumentSnapshotPromise(companyId);

        const workflowCheckpoints = workflowDocumentSnapshot.docs[0].data().workflowCheckpoints;
        const workflowCheckpointDocumentSnapshots = await Promise.all(workflowCheckpoints.map((workflowCheckpointId: string) => {
            return db.collection('workflowCheckpoints').doc(workflowCheckpointId).get();
        }));

        const fullWorkflowCheckpoints = workflowCheckpointDocumentSnapshots.map((workflowCheckpointDocumentSnapshot: firebase.firestore.DocumentSnapshot) => {
            return {
                id: workflowCheckpointDocumentSnapshot.id,
                ...workflowCheckpointDocumentSnapshot.data(),
            } as IWorkflowCheckpoint;
        });

        return fullWorkflowCheckpoints;
    }

    public async addWorkflowCheckpoint(companyId: string, workflowCheckpoint: IWorkflowCheckpointCreateRequest): Promise<IWorkflowCheckpoint> {
        const createWorkflowCheckpointPromise = db.collection('workflowCheckpoints').add({
            ...workflowCheckpoint,
            companyId,
        });

        const [
            workflowDocumentSnapshot,
            workflowCheckpointSnapshot,
        ] = await Promise.all([
            this.getWorkflowDocumentSnapshotPromise(companyId),
            createWorkflowCheckpointPromise,
        ]);

        const workflowCheckpoints = workflowDocumentSnapshot.docs[0].data().workflowCheckpoints;
        workflowCheckpoints.push(workflowCheckpointSnapshot.id);

        await db.collection('companyWorkflows')
            .doc(workflowDocumentSnapshot.docs[0].id)
            .set({
                workflowCheckpoints,
            }, { merge: true });

        return {
            id: workflowDocumentSnapshot.docs[0].id,
            ...workflowCheckpoint,
        }

    }

    public async removeWorkflowCheckpoint(companyId: string, workflowCheckpointIdToDelete: string): Promise<void> {
        const workflowDocumentSnapshot = await this.getWorkflowDocumentSnapshotPromise(companyId);

        const workflowCheckpoints = workflowDocumentSnapshot.docs[0].data().workflowCheckpoints;
        const checkpointsWithoutDeletedId = workflowCheckpoints.filter((workflowCheckpointId: string) => {
            return workflowCheckpointId !== workflowCheckpointIdToDelete;
        })

        await db.collection('companyWorkflows')
            .doc(workflowDocumentSnapshot.docs[0].id)
            .set({
                workflowCheckpoints: checkpointsWithoutDeletedId,
            }, { merge: true });
    }

    public async updateWorkflowCheckpoint(companyId: string, workflowCheckpoint: IWorkflowCheckpoint): Promise<IWorkflowCheckpoint> {
        await db.collection('workflowCheckpoints')
            .doc(workflowCheckpoint.id)
            .set({
                name: workflowCheckpoint.name,
                estimatedCompletionTime: workflowCheckpoint.estimatedCompletionTime,
                visibleToDoctor: workflowCheckpoint.visibleToDoctor,
            })

        return workflowCheckpoint;
    }

    private getWorkflowDocumentSnapshotPromise = (companyId: string): Promise<firebase.firestore.QuerySnapshot> => {
        return db.collection('companyWorkflows')
            .where('companyId', '==', companyId)
            .get();
    }
}