import { RouteComponentProps } from 'react-router';

export interface AuthenticationPresentationState {
    email: string;
    password: string;
}

export interface AuthenticationPresentationProps extends RouteComponentProps<{}> {
  clearAdminState: () => void;
}