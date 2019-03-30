import { ICheckboxTemplateControl } from "src/Models/prescription/controls/checkboxTemplateControl";

export interface ICheckboxEditPropsFromParent {
    control: ICheckboxTemplateControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
}

export interface ICheckboxEditProps extends ICheckboxEditPropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface ICheckboxEditState {}