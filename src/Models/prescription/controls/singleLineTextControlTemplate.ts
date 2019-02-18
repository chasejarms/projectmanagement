import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface ISingleLineTextControlTemplate extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.SingleLineText,
    label: string,
}