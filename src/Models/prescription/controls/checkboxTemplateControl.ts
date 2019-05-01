import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IOption } from "./option";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface ICheckboxTemplateControl extends IBasePrescriptionControlTemplate {
    label: string,
    type: IPrescriptionControlTemplateType.Checkbox,
    options: IOption[];
}