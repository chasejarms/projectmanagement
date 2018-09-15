import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from "react-router";

export interface IMyProjectsPresentationProps extends RouteComponentProps<{}>, WithTheme {}

// tslint:disable-next-line:no-empty-interface
export interface IMyProjectsPresentationState {}

export const createMyProjectsPresentationClasses = (
    props: IMyProjectsPresentationProps,
    state: IMyProjectsPresentationState,
) => {
    const rowStyling = css({
        cursor: 'pointer',
        flexShrink: 0,
        '&:hover': {
            backgroundColor: '#f5f5f5'
        },
    });

    const myProjectsContainer = css({
        height: '100vh',
        padding: 32,
        boxSizing: 'border-box',
        // backgroundColor: 'blue',
        // backgroundClip: 'polygon(100% 0, 0% 100%, 100% 100%)',
    });

    const fabButton = css({
        position: 'absolute',
        bottom: 16,
        right: 16,
    })

    const myProjectsToolbarContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    })

    const projectsTypography = css({
        color: 'black',
    });

    const projectsPaper = css({
        overflow: 'hidden',
    });

    return {
        rowStyling,
        myProjectsContainer,
        fabButton,
        myProjectsToolbarContainer,
        projectsTypography,
        projectsPaper,
    };
}