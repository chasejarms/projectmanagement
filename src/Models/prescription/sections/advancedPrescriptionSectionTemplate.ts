import { IBasePrescriptionSectionTemplate } from "./basePrescriptionSectionTemplate";
import { IPrescriptionSectionTemplateType } from "./prescriptionSectionTemplateType";

export interface IAdvancedPrescriptionSectionTemplate extends IBasePrescriptionSectionTemplate {
    type: IPrescriptionSectionTemplateType.Advanced,
}