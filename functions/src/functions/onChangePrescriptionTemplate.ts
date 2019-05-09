import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Collections } from '../models/collections';

export const onChangePrescriptionTemplateLocal = (passedInAdmin: admin.app.App) => functions.firestore
    .document(`${Collections.PrescriptionTemplate}/{prescriptionTemplateId}`)
    .onCreate(async(documentSnapshot) => {
        const prescriptionFormTemplate = documentSnapshot.data();

        let doctorControlExists: boolean = false;
        let caseDeadlineExists: boolean = false;

        prescriptionFormTemplate.sectionOrder.forEach((sectionId) => {
            const section = prescriptionFormTemplate.sections[sectionId];
            section.controlOrder.forEach((controlId) => {
                const control = prescriptionFormTemplate.controls[controlId];
                if (control.type === 'DoctorInformation') {
                    doctorControlExists = true;
                } else if (control.type === 'CaseDeadline') {
                    caseDeadlineExists = true;
                }
            })
        });

        const prescriptionTemplateHasSufficientFields = doctorControlExists && caseDeadlineExists;

        await passedInAdmin.firestore().collection(Collections.Company)
            .doc(prescriptionFormTemplate.companyId)
            .set({
                prescriptionTemplateHasSufficientFields,
            }, { merge: true });
    });