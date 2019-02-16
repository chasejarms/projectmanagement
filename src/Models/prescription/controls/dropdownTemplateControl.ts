import { IBasePrescriptionControlTemplate } from './basePrescriptionControlTemplate';
import { IOption } from './option';
import { IPrescriptionControlTemplateType } from './prescriptionControlTemplateType';

export interface IDropdownTemplateControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.Dropdown,
    label: string;
    options: IOption[];
}