import { IBasePrescriptionSectionTemplate } from "./basePrescriptionSectionTemplate";
import { IPrescriptionSectionTemplateType } from "./prescriptionSectionTemplateType";

export interface IDuplicatablePrescriptionSectionTemplate extends IBasePrescriptionSectionTemplate {
    type: IPrescriptionSectionTemplateType.Duplicatable,
}