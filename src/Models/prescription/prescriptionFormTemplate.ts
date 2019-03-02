import { IPrescriptionControlMapping } from "./prescriptionControlMapping";
import { IPrescriptionSectionMapping } from "./prescriptionSectionMapping";

export interface IPrescriptionFormTemplate {
    sectionOrder: string[];
    sections: IPrescriptionSectionMapping;
    controls: IPrescriptionControlMapping;
}