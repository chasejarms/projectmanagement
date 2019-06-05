import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IFormControlState } from "src/Classes/formControlState";

// tslint:disable-next-line:no-empty-interface
export interface IContactUsProps extends RouteComponentProps<any> {}
// tslint:disable-next-line:no-empty-interface
export interface IContactUsState {
    name: IFormControlState<string>;
    email: IFormControlState<string>;
    phoneNumber: IFormControlState<string>;
    message: IFormControlState<string>;
    contactUsInProgress: boolean;
    snackbarIsOpen: boolean;
    contactUsSuccess: boolean;
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
        position: 'relative',
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
    });

    const logoContainer = css({
        position: 'absolute',
        top: 0,
        left: 0,
        padding: 16,
    });

    const homeButtonContainer = css({
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 16,
    });

    return {
        pageContainer,
        formContainer,
        submitButtonContainer,
        logoContainer,
        homeButtonContainer,
    };
}