import { IDateTemplateControl } from "src/Models/prescription/controls/dateControlTemplate";

// tslint:disable-next-line:no-empty-interface
export interface IDateEditPropsFromParent {
    control: IDateTemplateControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
}

export interface IDateEditProps extends IDateEditPropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}
// tslint:disable-next-line:no-empty-interface
export interface IDateEditState {}