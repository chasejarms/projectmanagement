import { IPrescriptionSectionValidator } from "./prescriptionSectionValidator";

export interface IPrescriptionSectionTemplate {
    /** This id must be unique within its respective prescription template */
    id: string;
    title: string;
    validators: IPrescriptionSectionValidator[];
}