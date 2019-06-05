import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IFormControlState } from "src/Classes/formControlState";

// tslint:disable-next-line:no-empty-interface
export interface IResetPasswordProps extends RouteComponentProps<{}>, WithTheme {}
// tslint:disable-next-line:no-empty-interface
export interface IResetPasswordState {
    passwordResetInProgress: boolean;
    passwordResetWasSent: boolean;
    snackbarIsOpen: boolean;
    email: IFormControlState<string>;
}

export const createResetPasswordClasses = (
    props: IResetPasswordProps,
    state: IResetPasswordState,
) => {
    const resetPasswordContainer = css({
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
        alignItems: 'center',
    });

    const controlContainer = css({
        width: 400,
    });

    const actionItemContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    });

    const link = css({
        color: `${props.theme.palette.primary.main} !important`,
        marginLeft: 'auto !important',
        ['&:hover']: {
          textDecoration: 'underline',
          cursor: 'pointer',
        }
      });

    const linkContainer = css({
        display: 'flex',
        paddingBottom: 8,
        paddingTop: 8,
    });

    const logoContainer = css({
        position: 'absolute',
        top: 0,
        left: 0,
        padding: 16,
    });

    const backToHomeContainer = css({
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 16,
    });

    return {
        resetPasswordContainer,
        controlContainer,
        actionItemContainer,
        link,
        linkContainer,
        logoContainer,
        backToHomeContainer,
    };
}