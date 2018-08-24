import { Theme, WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';

// tslint:disable-next-line:no-empty-interface
export interface IProjectPresentationProps extends RouteComponentProps<{}>, WithTheme {}

export interface IProjectPresentationState {
    tabValue: number;
}

export const createProjectPresentationClasses = (
    props: IProjectPresentationProps,
    state: IProjectPresentationState,
    theme: Theme,
) => {
    const projectContainer = css({
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    })

    const tabs = css({
        flexBasis: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    })

    const tabsContentContainer = css({
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    })

    const selectedTab = css({
        color: theme.palette.primary.main,
    })

    const nonSelectedTab = css({
        color: 'white',
    })

    return {
        projectContainer,
        tabs,
        tabsContentContainer,
        selectedTab,
        nonSelectedTab,
    };
}