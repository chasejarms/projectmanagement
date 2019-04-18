import { css } from 'emotion';
import { ICheckboxTemplateControl } from "src/Models/prescription/controls/checkboxTemplateControl";

export interface ICheckboxEditPropsFromParent {
    control: ICheckboxTemplateControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
    makeBlackAndWhite?: boolean;
}

export interface ICheckboxEditProps extends ICheckboxEditPropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface ICheckboxEditState {}

export const createCheckboxEditClasses = (
    props: ICheckboxEditProps,
    state: ICheckboxEditState,
) => {
    const checkboxStyles = props.makeBlackAndWhite ? { color: 'black !important' } : {};
    const checkbox = css(checkboxStyles);

    return {
        checkbox,
    }
}