import { css } from 'emotion';
import { IFormControlState } from "src/Classes/formControlState";

// tslint:disable-next-line:no-empty-interface
export interface IContactUsProps {}
// tslint:disable-next-line:no-empty-interface
export interface IContactUsState {
    name: IFormControlState<string>;
    email: IFormControlState<string>;
    phoneNumber: IFormControlState<string>;
    message: IFormControlState<string>;
}

export const createContactUsClasses = (
    props: IContactUsProps,
    state: IContactUsState,
) => {
    const pageContainer = css({
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        padding: 32,
    });

    const formContainer = css({
        width: 600,
        display: 'grid',
        gridGap: 8,
        overflowY: 'auto',
    });

    const submitButtonContainer = css({
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-end',
        paddingTop: 16,
    })

    return {
        pageContainer,
        formContainer,
        submitButtonContainer,
    };
}