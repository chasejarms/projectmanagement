import { IProjectDeadlineControl } from "src/Models/prescription/controls/caseDeadlineControl";

export interface IProjectDeadlinePropsFromParent {
    control: IProjectDeadlineControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
}

export interface IProjectDeadlineProps extends IProjectDeadlinePropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}
// tslint:disable-next-line:no-empty-interface
export interface IProjectDeadlineState {}