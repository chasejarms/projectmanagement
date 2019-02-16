import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface ITitleTemplateControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.Title,
    title: string,
}