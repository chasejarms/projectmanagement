import { ISingleLineTextControlTemplate } from "src/Models/prescription/controls/singleLineTextControlTemplate";

// tslint:disable-next-line:no-empty-interface
export interface ISingleLineTextEditPropsFromParent {
    control: ISingleLineTextControlTemplate;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
}
// tslint:disable-next-line:no-empty-interface
export interface ISingleLineTextEditProps extends ISingleLineTextEditPropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}
// tslint:disable-next-line:no-empty-interface
export interface ISingleLineTextEditState {}