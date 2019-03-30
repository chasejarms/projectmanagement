import { IPrescriptionFormTemplate } from "src/Models/prescription/prescriptionFormTemplate";
import { IPrescriptionValues } from "src/Models/prescription/prescriptionValues";

// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionEditState {}
// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionEditProps {
    prescriptionBuilderTemplate: IPrescriptionFormTemplate;
    prescriptionValues: IPrescriptionValues;
    disabled: boolean;
    // needs an action to dispatch when things change
    // might even need a few actions honestly
}