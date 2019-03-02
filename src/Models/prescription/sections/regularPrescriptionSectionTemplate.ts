import { IBasePrescriptionSectionTemplate } from "./basePrescriptionSectionTemplate";
import { IPrescriptionSectionTemplateType } from "./prescriptionSectionTemplateType";

export interface IRegularPrescriptionSectionTemplate extends IBasePrescriptionSectionTemplate {
    type: IPrescriptionSectionTemplateType.Regular,
}