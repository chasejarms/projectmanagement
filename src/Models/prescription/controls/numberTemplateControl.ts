import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface INumberTemplateControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.Number;
    prefix: string;
    suffix: string;
    label: string;
}