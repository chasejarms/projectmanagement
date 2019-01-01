import { db } from './../../firebase';
import { ICaseNotesApi } from './caseNotesInterface';

export class CaseNotesApi implements ICaseNotesApi {
    public async getCaseNotes(companyId: string): Promise<string> {
        const workflowDocumentSnapshot = await this.getWorkflowDocumentSnapshotPromise(companyId);
        const caseTemplateId = workflowDocumentSnapshot.docs[0].data().caseNotesTemplate;

        const caseNotes = await db.collection('caseNotesTemplate')
            .doc(caseTemplateId)
            .get();

        return caseNotes.data()!.notes;
    }

    public async updateCaseNotes(companyId: string, updatedCaseNotes: string): Promise<void> {
        const workflowDocumentSnapshot = await this.getWorkflowDocumentSnapshotPromise(companyId);
        const caseTemplateId = workflowDocumentSnapshot.docs[0].data().caseNotesTemplate;
        await db.collection('caseNotesTemplate')
            .doc(caseTemplateId)
            .set({
                notes: updatedCaseNotes,
            });
    }

    private getWorkflowDocumentSnapshotPromise = (companyId: string): Promise<firebase.firestore.QuerySnapshot> => {
        return db.collection('companyWorkflows')
            .where('companyId', '==', companyId)
            .get();
    }
}