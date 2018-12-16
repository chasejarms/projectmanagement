import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IUser } from '../../Models/user';
import { IUserSliceOfState } from '../../Redux/Reducers/userReducer';

export interface IRouteGuardPresentationProps extends RouteComponentProps<{}> {
  path: string;
  component: React.ComponentClass;
  user: IUserSliceOfState;
  setUser: (user: IUser) => void;
  mustHaveRole: string[];
}

export interface IRouteGuardPresentationState {
  userCanViewPage: boolean | undefined;
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