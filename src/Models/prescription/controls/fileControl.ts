import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface IFileControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.File,
    label: string,
}