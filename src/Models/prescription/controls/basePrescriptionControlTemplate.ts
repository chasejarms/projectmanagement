import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface IBasePrescriptionControlTemplate {
    /** This id must be unique within its respective prescription template */
    id: string;
    /** The section id that this control goes under */
    sectionId: string;
    type: IPrescriptionControlTemplateType;
}