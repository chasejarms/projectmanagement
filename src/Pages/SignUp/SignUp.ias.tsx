import { WithTheme } from '@material-ui/core';
import { css } from 'emotion'
import { RouteComponentProps } from 'react-router';
import { IFormControlState } from '../../Classes/formControlState';

export interface ISignUpPresentationProps extends RouteComponentProps<{}>, WithTheme {}

export interface ISignUpPresentationState {
    fullName: IFormControlState<string>;
    companyName: IFormControlState<string>;
    email: IFormControlState<string>;
    password: IFormControlState<string>;
    signUpActionInProgress: boolean;
}
export const createAuthenticationClasses = (
  props: ISignUpPresentationProps,
  state: ISignUpPresentationState,
) => {
  const signUpContainer = css({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
  })

  const signUpRow = css({
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
    signUpContainer,
    signUpRow,
    textField,
    actionContainer,
    actionButton,
  };
}