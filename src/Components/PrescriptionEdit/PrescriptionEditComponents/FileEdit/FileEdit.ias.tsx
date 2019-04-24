import { css } from 'emotion';
import { IFileControl } from "src/Models/prescription/controls/fileControl";

export interface IFileEditPropsFromParent {
    control: IFileControl;
    controlValue: any;
    disabled: boolean;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
}

export interface IFileEditProps extends IFileEditPropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}
// tslint:disable-next-line:no-empty-interface
export interface IFileEditState {}

export const createFileEditClasses = (
    props: IFileEditProps,
    state: IFileEditState,
) => {
    const addAttachmentInput = css({
        position: 'absolute',
        width: '100%',
        height: '100%',
        paddingTop: 100,
    });

    const addAttachmentButton = css({
        position: 'relative',
        overflow: 'hidden',
    });

    return {
        addAttachmentButton,
        addAttachmentInput,
    };
}