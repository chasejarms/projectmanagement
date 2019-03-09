import { db } from 'src/firebase';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { IPrescriptionTemplateApi } from './prescriptionTemplateInterface';

export class PrescriptionTemplateApi implements IPrescriptionTemplateApi {
    public async getPrescriptionTemplate(companyId: string): Promise<IPrescriptionFormTemplate> {
        const workflowDocumentSnapshots = await this.getWorkflowDocumentSnapshotPromise(companyId);
        const prescriptionTemplateId = workflowDocumentSnapshots.docs[0].data().prescriptionTemplate;
        const prescriptionTemplate = await db.collection('prescriptionTemplates').doc(prescriptionTemplateId).get();
        return {
            ...prescriptionTemplate.data() as IPrescriptionFormTemplate,
        };
    };
    public async updatePrescriptionTemplate(companyId: string, prescriptionFormTemplate: IPrescriptionFormTemplate): Promise<IPrescriptionFormTemplate> {
        const workflowDocumentSnapshots = await this.getWorkflowDocumentSnapshotPromise(companyId);
        const companyWorkflowId = workflowDocumentSnapshots.docs[0].id;
        const newPrescriptionTemplate = await db.collection('prescriptionTemplates').add(prescriptionFormTemplate);
        await db.collection('companyWorkflows').doc(companyWorkflowId).set({
            prescriptionTemplate: newPrescriptionTemplate.id,
        }, { merge: true });

        return prescriptionFormTemplate;
    }

    private getWorkflowDocumentSnapshotPromise = (companyId: string): Promise<firebase.firestore.QuerySnapshot> => {
        return db.collection('companyWorkflows')
            .where('companyId', '==', companyId)
            .get();
    }
}