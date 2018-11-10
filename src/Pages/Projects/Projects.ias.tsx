import { css } from 'emotion';
import { RouteComponentProps } from "react-router";
import { ISlimProject } from '../../Models/slimProject';

export interface IProjectsPresentationProps extends RouteComponentProps<{}> {}

// tslint:disable-next-line:no-empty-interface
export interface IProjectsPresentationState {
    slimProjects?: ISlimProject[];
}

export const createProjectsPresentationClasses = (
    props: IProjectsPresentationProps,
    state: IProjectsPresentationState,
) => {
    const rowStyling = css({
        cursor: 'pointer',
        flexShrink: 0,
        '&:hover': {
            backgroundColor: '#f5f5f5'
        },
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
    });

    const projectsToolbarContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    });

    const projectsPaper = css({
        overflow: 'hidden',
    });

    return {
        rowStyling,
        projectsContainer,
        fabButton,
        projectsToolbarContainer,
        projectsPaper,
    };
}