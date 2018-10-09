import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { ICheckpoint } from '../../Models/checkpoint';

// tslint:disable-next-line:no-empty-interface
export interface IProjectProgressProps extends RouteComponentProps<{}>, WithTheme {}
// tslint:disable-next-line:no-empty-interface
export interface IProjectProgressState {
    checkpoints: ICheckpoint[];
}

export const projectProgressClasses = (
    props: IProjectProgressProps,
    state: IProjectProgressState,
) => {
    const checkpointsContainer = css({
        padding: 32,
    });

    const checkpointStyling = css({
        marginBottom: 16,
    })

    const completionBar = css({
        marginBottom: 16,
        paddingBottom: 32,
    });

    const sectionHeader = css({
        paddingBottom: 16,
    })

    return {
        checkpointsContainer,
        checkpointStyling,
        completionBar,
        sectionHeader,
    };
}

