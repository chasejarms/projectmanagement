import { Collections } from 'src/Models/collections';
import { db } from './../../firebase';
import { IWorkflow, IWorkflowCheckpoint, IWorkflowCheckpointCreateRequest } from './../../Models/workflow';
import { IWorkflowApi } from './workflowApiInterface';

export class WorkflowApi implements IWorkflowApi {
    public async getWorkflow(companyId: string): Promise<IWorkflow> {
        const workflowDocumentSnapshot = await this.getWorkflowDocumentSnapshotPromise(companyId);

        const workflowCheckpointIds = workflowDocumentSnapshot.docs[0].data().workflowCheckpointIds;
        const workflowCheckpointDocumentSnapshots = await Promise.all(workflowCheckpointIds.map((workflowCheckpointId: string) => {
            return db.collection(Collections.WorkflowCheckpoint).doc(workflowCheckpointId).get();
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
        const createWorkflowCheckpointPromise = db.collection(Collections.WorkflowCheckpoint).add({
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

        const workflowCheckpointIds = workflowDocumentSnapshot.docs[0].data().workflowCheckpointIds;
        workflowCheckpointIds.push(workflowCheckpointSnapshot.id);

        await db.collection(Collections.CompanyWorkflow)
            .doc(workflowDocumentSnapshot.docs[0].id)
            .set({
                workflowCheckpointIds,
            }, { merge: true });

        return {
            id: workflowCheckpointSnapshot.id,
            ...workflowCheckpoint,
        }

    }

    public async removeWorkflowCheckpoint(companyId: string, workflowCheckpointIdToDelete: string): Promise<void> {
        const workflowDocumentSnapshot = await this.getWorkflowDocumentSnapshotPromise(companyId);

        const workflowCheckpointIds = workflowDocumentSnapshot.docs[0].data().workflowCheckpointIds;
        const checkpointsWithoutDeletedId = workflowCheckpointIds.filter((workflowCheckpointId: string) => {
            return workflowCheckpointId !== workflowCheckpointIdToDelete;
        })

        await db.collection(Collections.CompanyWorkflow)
            .doc(workflowDocumentSnapshot.docs[0].id)
            .set({
                workflowCheckpointIds: checkpointsWithoutDeletedId,
            }, { merge: true });
    }

    public async updateWorkflowCheckpoint(companyId: string, workflowCheckpoint: IWorkflowCheckpoint): Promise<IWorkflowCheckpoint> {
        await db.collection(Collections.WorkflowCheckpoint)
            .doc(workflowCheckpoint.id)
            .set({
                name: workflowCheckpoint.name,
                estimatedCompletionTime: workflowCheckpoint.estimatedCompletionTime,
                visibleToDoctor: workflowCheckpoint.visibleToDoctor,
            }, { merge: true });

        return workflowCheckpoint;
    }

    public async updateWorkflowCheckpointOrder(companyId: string, newCheckpointOrder: string[]): Promise<void> {
        const workflowDocumentSnapshot = await this.getWorkflowDocumentSnapshotPromise(companyId);
        const workflowCheckpointId = workflowDocumentSnapshot.docs[0].id;

        await db.collection(Collections.CompanyWorkflow)
            .doc(workflowCheckpointId)
            .set({
                workflowCheckpointIds: newCheckpointOrder,
            }, { merge: true });
    }

    private getWorkflowDocumentSnapshotPromise = (companyId: string): Promise<firebase.firestore.QuerySnapshot> => {
        return db.collection(Collections.CompanyWorkflow)
            .where('companyId', '==', companyId)
            .get();
    }
}