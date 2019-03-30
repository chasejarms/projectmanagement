import { IDropdownTemplateControl } from "src/Models/prescription/controls/dropdownTemplateControl";

export interface IDropdownEditPropsFromParent {
    control: IDropdownTemplateControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
}

export interface IDropdownEditProps extends IDropdownEditPropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}
// tslint:disable-next-line:no-empty-interface
export interface IDropdownEditState {}