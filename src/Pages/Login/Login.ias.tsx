import { WithTheme } from '@material-ui/core';
import { css } from 'emotion'
import { RouteComponentProps } from 'react-router';
import { IFormControlState } from '../../Classes/formControlState';

export interface ILoginPresentationProps extends RouteComponentProps<{}>, WithTheme {}

export interface ILoginPresentationState {
    email: IFormControlState<string>;
    password: IFormControlState<string>;
    loginActionInProgress: boolean;
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
    position: 'relative',
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
    loginContainer,
    loginRow,
    textField,
    actionContainer,
    actionButton,
    link,
    linkContainer,
    logoContainer,
    backToHomeContainer,
  };
}