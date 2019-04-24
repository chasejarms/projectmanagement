import { IPrescriptionFormTemplate } from "src/Models/prescription/prescriptionFormTemplate";

export interface IPrescriptionTemplateApi {
    getPrescriptionTemplate(companyId: string): Promise<IPrescriptionFormTemplate>;
    updatePrescriptionTemplate(companyId: string, prescriptionFormTemplate: IPrescriptionFormTemplate): Promise<IPrescriptionFormTemplate>;
    getPrescriptionTemplateById(prescriptionTemplateId: string): Promise<IPrescriptionFormTemplate>;
    /**
     * Return the full path to the company logo
     */
    updateCompanyLogo(companyId: string, prescriptionTemplateId: string, file: File): Promise<string>;
    removeCompanyLogo(prescriptionTemplateId: string): Promise<boolean>;
}