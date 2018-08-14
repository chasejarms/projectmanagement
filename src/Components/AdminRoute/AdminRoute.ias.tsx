import { RouteComponentProps } from 'react-router';

export interface IAdminRoutePresentationProps extends RouteComponentProps<{}> {
  isAdmin: boolean;
  path: string;
  component: React.ComponentClass;
  setIsAdmin: (isAdmin: boolean) => void;
}

export interface IAdminRoutePresentationState {
  userHasAdminRight: boolean | undefined;
}