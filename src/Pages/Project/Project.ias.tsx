import { Theme, WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { ICheckpoint } from '../../Models/checkpoint';

// tslint:disable-next-line:no-empty-interface
export interface IProjectPresentationProps extends RouteComponentProps<{}>, WithTheme {}

export interface IProjectPresentationState {
    tabValue: number;
    projectName: string;
    checkpoints: ICheckpoint[];
}

export const createProjectPresentationClasses = (
    props: IProjectPresentationProps,
    state: IProjectPresentationState,
    theme: Theme,
) => {
    const projectContainer = css({
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 32,
        paddingLeft: 32,
        paddingBottom: 32,
    })

    const evenPaper = css({
        flexDirection: 'column',
        flexGrow: 1,
        marginRight: 32,
        padding: 16,
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
    });

    const secondPaper = css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        marginRight: 32,
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
    });

    const tabs = css({
        flexBasis: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    })

    const tabsContentContainer = css({
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    });

    const fieldSpacing = css({
        marginBottom: 16,
        flexGrow: 1,
    });

    const selectedTab = css({
        color: theme.palette.primary.main,
    })

    const nonSelectedTab = css({
        color: 'white',
    });

    const halfWidthProjectContainer = css({
        flex: 1,
    });

    const attachmentButtonsContainer = css({
        padding: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    });

    const seeAttachmentsButton = css({
        marginRight: 8,
    });

    const workflowToolbar = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    });

    return {
        projectContainer,
        tabs,
        tabsContentContainer,
        selectedTab,
        nonSelectedTab,
        evenPaper,
        secondPaper,
        fieldSpacing,
        halfWidthProjectContainer,
        attachmentButtonsContainer,
        seeAttachmentsButton,
        workflowToolbar,
    };
}