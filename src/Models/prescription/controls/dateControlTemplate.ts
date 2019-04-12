
import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface IDateTemplateControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.Date,
    label: string,
}