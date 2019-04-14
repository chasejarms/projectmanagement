import { css } from 'emotion';
import { IDateTemplateControl } from "src/Models/prescription/controls/dateControlTemplate";

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

export const createDateEditClasses = (
    props: IDateEditProps,
    state: IDateEditState,
) => {
    const dateEditContainer = css({
        position: 'relative',
    });

    const mask = css({
        position: 'absolute',
        width: '100%',
        height: '100%',
    })

    return {
        mask,
        dateEditContainer,
    };
}