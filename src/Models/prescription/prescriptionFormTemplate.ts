import { IPrescriptionControlMapping } from "./prescriptionControlMapping";
import { IPrescriptionSectionMapping } from "./prescriptionSectionMapping";

export interface IPrescriptionFormTemplate {
    id?: string;
    sectionOrder: string[];
    sections: IPrescriptionSectionMapping;
    controls: IPrescriptionControlMapping;
    companyLogoURL: string | null;
    companyId: string;
}