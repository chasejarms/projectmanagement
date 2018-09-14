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
    });

    const myProjectsContainer = css({
        height: '100vh',
        padding: 32,
        boxSizing: 'border-box',
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
    })

    const projectsTypography = css({
        color: 'black',
    })

    return {
        rowStyling,
        myProjectsContainer,
        fabButton,
        myProjectsToolbarContainer,
        projectsTypography,
    };
}