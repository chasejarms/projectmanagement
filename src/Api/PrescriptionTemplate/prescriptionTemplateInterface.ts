import { IPrescriptionFormTemplate } from "src/Models/prescription/prescriptionFormTemplate";

export interface IPrescriptionTemplateApi {
    getPrescriptionTemplate(companyId: string): Promise<IPrescriptionFormTemplate>;
    updatePrescriptionTemplate(companyId: string, prescriptionFormTemplate: IPrescriptionFormTemplate): Promise<IPrescriptionFormTemplate>;
    getPrescriptionTemplateById(prescriptionTemplateId: string): Promise<IPrescriptionFormTemplate>;
}