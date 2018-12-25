import { WithTheme } from '@material-ui/core';
import { css } from 'emotion'
import { RouteComponentProps } from 'react-router';
import { IFormControlState } from '../../Classes/formControlState';

export interface ILoginPresentationProps extends RouteComponentProps<{}>, WithTheme {}

export interface ILoginPresentationState {
    email: IFormControlState<string>;
    password: IFormControlState<string>;
    loginActionInProgress: boolean;
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

  return {
    loginContainer,
    loginRow,
    textField,
    actionContainer,
    actionButton,
  };
}