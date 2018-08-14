import { css } from 'emotion';
import * as cssVariables from '../../Styles/variables';
import { RouteComponentProps } from 'react-router';

export interface MainPresentationProps extends RouteComponentProps<{}> {}

export interface MainPresentationState {}

export const createMainClasses = (
    props: MainPresentationProps,
    state: MainPresentationState,
) => {
    return {
      appContainer: css({
        height: '100vh',
        backgroundColor: cssVariables.mediumGray,
      })
    };
  };