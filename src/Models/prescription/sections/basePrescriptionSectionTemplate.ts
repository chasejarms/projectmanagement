import { IPrescriptionSectionTemplateType } from "./prescriptionSectionTemplateType";

export interface IBasePrescriptionSectionTemplate {
    /** This id must be unique within its respective prescription template */
    id: string;
    type: IPrescriptionSectionTemplateType;
    controlOrder: string[];
}