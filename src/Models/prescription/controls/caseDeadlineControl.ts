import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface ICaseDeadlineControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.CaseDeadline,
    label: string,
    autofillDays: number,
}