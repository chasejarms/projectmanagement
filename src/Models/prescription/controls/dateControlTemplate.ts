import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";

export interface IDateTemplateControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.Date,
    label: string,
}