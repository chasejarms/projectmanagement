import { IAdvancedPrescriptionSectionTemplate } from "./advancedPrescriptionSectionTemplate";
import { IDuplicatablePrescriptionSectionTemplate } from "./duplicatablePrescriptionSectionTemplate";
import { IRegularPrescriptionSectionTemplate } from "./regularPrescriptionSectionTemplate";

export type IPrescriptionSectionTemplate = IRegularPrescriptionSectionTemplate |
    IDuplicatablePrescriptionSectionTemplate |
    IAdvancedPrescriptionSectionTemplate;