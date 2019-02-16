import { IPrescriptionControlMapping } from "./prescriptionControlMapping";
import { IPrescriptionControlOrder } from "./prescriptionControlOrder";
import { IPrescriptionSectionMapping } from "./prescriptionSectionMapping";

export interface IPrescriptionFormTemplate {
    sectionOrder: string[];
    controlOrder: IPrescriptionControlOrder;
    sections: IPrescriptionSectionMapping;
    controls: IPrescriptionControlMapping;
}