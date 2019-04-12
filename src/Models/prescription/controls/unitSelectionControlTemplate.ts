import { IUnitNumber } from "../../unitNumber";
import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface IUnitSelectionControlTemplate extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.UnitSelection,
    units: IUnitNumber[];
}