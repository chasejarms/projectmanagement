import { WithTheme } from '@material-ui/core';
import { css } from 'emotion'
import { RouteComponentProps } from 'react-router';

export interface IAuthenticationPresentationState {
    companyName?: string;
    fullName?: string;
    email: string;
    password: string;
}

export interface IAuthenticationPresentationProps extends RouteComponentProps<{}>, WithTheme {
  clearAdminState: () => void;
}

export const createAuthenticationClasses = (
  props: IAuthenticationPresentationProps,
  state: IAuthenticationPresentationState,
) => {
  const authenticationContainer = css({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
  })

  const authenticationRow = css({
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
    authenticationContainer,
    authenticationRow,
    textField,
    actionContainer,
    actionButton,
  };
}