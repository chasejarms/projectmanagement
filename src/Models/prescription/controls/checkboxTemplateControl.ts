import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IOption } from "./option";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface ICheckboxTemplateControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.Checkbox,
    options: IOption[];
}