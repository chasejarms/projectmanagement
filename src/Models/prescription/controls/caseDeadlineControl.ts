import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface IProjectDeadlineControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.CaseDeadline,
    label: string,
    autofillDays: number,
}