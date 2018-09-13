import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';


// tslint:disable-next-line:no-empty-interface
export interface IProjectProgressProps extends WithTheme {}
// tslint:disable-next-line:no-empty-interface
export interface IProjectProgressState {}

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

