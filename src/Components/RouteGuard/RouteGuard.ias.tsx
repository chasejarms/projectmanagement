import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IUser } from '../../Models/user';
import { IUserSliceOfState } from '../../Redux/Reducers/userReducer';

import * as _ from 'firebase';
import { IAuthenticatedUISliceOfState } from 'src/Redux/Reducers/authenticatedUIReducer';

export interface IRouteGuardPresentationProps extends RouteComponentProps<{}> {
  path: string;
  component: React.ComponentClass;
  userState: IUserSliceOfState;
  authenticatedUIState: IAuthenticatedUISliceOfState;
  setUser: (companyId: string, user: IUser) => void;
  setHasMultipleCompanies: (hasMultipleCompanies: boolean) => void;
  mustHaveRole: string[];
  exact?: boolean;
}

export interface IRouteGuardPresentationState {
  userCanViewPage: boolean | undefined;
  unsubscribe: firebase.Unsubscribe | undefined;
}

export const createRouteGuardClasses = (
  props: IRouteGuardPresentationProps,
  state: IRouteGuardPresentationState,
) => {
  const loadingPageContainer = css({
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  });

  return {
    loadingPageContainer,
  };
}