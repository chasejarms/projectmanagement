import { IPrescriptionSectionTemplate } from "./sections/prescriptionSectionTemplate";

export interface IPrescriptionSectionMapping {
    /** The section id followed by the actual prescription section template */
    [sectionId: string]: IPrescriptionSectionTemplate;
}