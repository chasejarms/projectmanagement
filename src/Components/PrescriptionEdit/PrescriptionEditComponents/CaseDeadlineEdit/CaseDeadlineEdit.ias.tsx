import { ICaseDeadlineControl } from "src/Models/prescription/controls/caseDeadlineControl";

export interface ICaseDeadlinePropsFromParent {
    control: ICaseDeadlineControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
}

export interface ICaseDeadlineProps extends ICaseDeadlinePropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}
// tslint:disable-next-line:no-empty-interface
export interface ICaseDeadlineState {}