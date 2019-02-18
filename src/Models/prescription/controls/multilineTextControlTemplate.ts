import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface IMultilineTextControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.MultilineText,
    label: string,
}