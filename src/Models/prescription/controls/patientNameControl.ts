import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface IPatientNameControl extends IBasePrescriptionControlTemplate {
    label: string,
    type: IPrescriptionControlTemplateType.PatientName,
}