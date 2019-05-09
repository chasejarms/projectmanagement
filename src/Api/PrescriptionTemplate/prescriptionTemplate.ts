import * as firebase from 'firebase';
import { db } from 'src/firebase';
import { Collections } from 'src/Models/collections';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { generateUniqueId } from 'src/Utils/generateUniqueId';
import { IPrescriptionTemplateApi } from './prescriptionTemplateInterface';

export class PrescriptionTemplateApi implements IPrescriptionTemplateApi {
    public async getPrescriptionTemplate(companyId: string): Promise<IPrescriptionFormTemplate> {
        const workflowDocumentSnapshots = await this.getWorkflowDocumentSnapshotPromise(companyId);
        const prescriptionTemplateId = workflowDocumentSnapshots.docs[0].data().prescriptionTemplate;
        const prescriptionTemplate = await db.collection(Collections.PrescriptionTemplate).doc(prescriptionTemplateId).get();
        return {
            ...prescriptionTemplate.data() as IPrescriptionFormTemplate,
            id: prescriptionTemplate.id,
        };
    };
    public async updatePrescriptionTemplate(companyId: string, prescriptionFormTemplate: IPrescriptionFormTemplate): Promise<IPrescriptionFormTemplate> {
        const workflowDocumentSnapshots = await this.getWorkflowDocumentSnapshotPromise(companyId);
        const companyWorkflowId = workflowDocumentSnapshots.docs[0].id;
        const newPrescriptionTemplate = await db.collection(Collections.PrescriptionTemplate).add({
            ...prescriptionFormTemplate,
            companyId,
        });
        await db.collection(Collections.CompanyWorkflow).doc(companyWorkflowId).set({
            prescriptionTemplate: newPrescriptionTemplate.id,
            id: newPrescriptionTemplate.id,
        }, { merge: true });

        return prescriptionFormTemplate;
    }

    public async getPrescriptionTemplateById(prescriptionTemplateId: string): Promise<IPrescriptionFormTemplate> {
        const prescriptionFormTemplate = await db.collection(Collections.PrescriptionTemplate)
            .doc(prescriptionTemplateId)
            .get();

        return {
            ...prescriptionFormTemplate.data() as IPrescriptionFormTemplate,
            id: prescriptionFormTemplate.id,
        };
    }

    public async updateCompanyLogo(companyId: string, prescriptionTemplateId: string, file: File): Promise<string> {
        const storageRef = firebase.storage().ref();
        const uniqueIdentifier = generateUniqueId();
        const updatedStorageRef = storageRef.child(`${companyId}/companyLogos/${uniqueIdentifier}/${file.name}`);
        const uploadTaskSnapshot: firebase.storage.UploadTaskSnapshot = await updatedStorageRef.put(file);

        const companyLogoURL = uploadTaskSnapshot.metadata.fullPath;
        await db.collection(Collections.PrescriptionTemplate)
            .doc(prescriptionTemplateId)
            .set({
                companyLogoURL,
            }, { merge: true });

        return companyLogoURL;
    }

    public async removeCompanyLogo(prescriptionTemplateId: string): Promise<boolean> {
        /*
            Of note here is that we do not remove the image from storage as that image may be referenced
            on older prescription template versions and should continue to exist.
        */
        await db.collection(Collections.PrescriptionTemplate)
            .doc(prescriptionTemplateId)
            .set({
                companyLogoURL: null,
            }, { merge: true });

        return true;
    }

    private getWorkflowDocumentSnapshotPromise = (companyId: string): Promise<firebase.firestore.QuerySnapshot> => {
        return db.collection(Collections.CompanyWorkflow)
            .where('companyId', '==', companyId)
            .get();
    }
}