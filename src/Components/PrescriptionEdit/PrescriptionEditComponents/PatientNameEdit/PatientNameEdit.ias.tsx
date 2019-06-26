import { IPatientNameControl } from "src/Models/prescription/controls/patientNameControl";

// tslint:disable-next-line:no-empty-interface
export interface IPatientNameEditPropsFromParent {
    control: IPatientNameControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
}
// tslint:disable-next-line:no-empty-interface
export interface IPatientNameEditProps extends IPatientNameEditPropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}
// tslint:disable-next-line:no-empty-interface
export interface IPatientNameEditState {}