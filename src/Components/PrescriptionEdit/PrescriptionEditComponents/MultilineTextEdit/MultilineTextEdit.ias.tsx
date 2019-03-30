import { IMultilineTextControl } from "src/Models/prescription/controls/multilineTextControlTemplate";

export interface IMultilineTextEditPropsFromParent {
    control: IMultilineTextControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
}

export interface IMultilineTextEditProps extends IMultilineTextEditPropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface IMultilineTextEditState {}