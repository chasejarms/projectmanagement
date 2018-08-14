import { RouteComponentProps } from 'react-router';

export interface AdminRoutePresentationProps extends RouteComponentProps<{}> {
  isAdmin: boolean;
  path: string;
  component: React.ComponentClass;
  setIsAdmin: (isAdmin: boolean) => void;
}

export interface AdminRoutePresentationState {
  userHasAdminRight: boolean | undefined;
}