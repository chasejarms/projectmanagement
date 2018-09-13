import { css } from 'emotion';
import { RouteComponentProps } from "react-router";

export interface IProjectsPresentationProps extends RouteComponentProps<{}> {}

// tslint:disable-next-line:no-empty-interface
export interface IProjectsPresentationState {}

export const createProjectsPresentationClasses = (
    props: IProjectsPresentationProps,
    state: IProjectsPresentationState,
) => {
    const rowStyling = css({
        cursor: 'pointer',
        flexShrink: 0,
    });

    const projectsContainer = css({
        height: '100vh',
        padding: 32,
        boxSizing: 'border-box',
    });

    const fabButton = css({
        position: 'absolute',
        bottom: 16,
        right: 16,
    })

    const projectsToolbarContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    })

    return {
        rowStyling,
        projectsContainer,
        fabButton,
        projectsToolbarContainer,
    };
}