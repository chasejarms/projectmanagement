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
    });

    const fabButton = css({
        position: 'absolute',
        bottom: 8,
        right: 8,
    })

    return {
        rowStyling,
        projectsContainer,
        fabButton,
    };
}