import { IBasePrescriptionControlTemplate } from "./basePrescriptionControlTemplate";
import { IPrescriptionControlTemplateType } from "./prescriptionControlTemplateType";

export interface IDoctorInformationTemplateControl extends IBasePrescriptionControlTemplate {
    type: IPrescriptionControlTemplateType.DoctorInformation;
}