import { WithTheme } from '@material-ui/core';
import { css } from 'emotion'
import { RouteComponentProps } from 'react-router';
import { IFormControlState } from '../../Classes/formControlState';

export interface ILoginPresentationProps extends RouteComponentProps<{}>, WithTheme {}

export interface ILoginPresentationState {
    email: IFormControlState<string>;
    password: IFormControlState<string>;
    loginActionInProgress: boolean;
    passwordResetInProgress: boolean;
    snackbarIsOpen: boolean;
    passwordResetWasSent: boolean;
    dialogIsOpen: boolean;
}
export const createAuthenticationClasses = (
  props: ILoginPresentationProps,
  state: ILoginPresentationState,
) => {
  const loginContainer = css({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
  })

  const loginRow = css({
    minWidth: 400,
    marginBottom: 8,
  })

  const textField = css({
    width: '100%',
  })

  const actionContainer = css({
    marginTop: 16,
    display: 'flex',
  })

  const actionButton = css({
    marginLeft: 'auto !important',
  })

  const linkObject = {
    color: `${state.passwordResetInProgress ? props.theme.palette.grey : props.theme.palette.primary.main} !important`,
    marginLeft: 'auto !important',
  };

  if (!state.passwordResetInProgress) {
    linkObject['&:hover'] = {
      textDecoration: 'underline',
      cursor: 'pointer',
    }
  }

  const link = css(linkObject);

  const linkContainer = css({
    display: 'flex',
  });

  return {
    loginContainer,
    loginRow,
    textField,
    actionContainer,
    actionButton,
    link,
    linkContainer,
  };
}