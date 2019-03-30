import { INumberTemplateControl } from "src/Models/prescription/controls/numberTemplateControl";

export interface INumberEditPropsFromParent {
    control: INumberTemplateControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
}

export interface INumberEditProps extends INumberEditPropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface INumberEditState {}