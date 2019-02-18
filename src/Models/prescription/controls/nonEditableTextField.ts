import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface INonEditableTextField extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.NonEditableText;
    text: string;
}