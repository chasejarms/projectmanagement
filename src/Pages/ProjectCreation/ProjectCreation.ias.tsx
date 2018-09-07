import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface IProjectCreationProps extends WithTheme {}
// tslint:disable-next-line:no-empty-interface
export interface IProjectCreationState {
    activeStep: number;
}

export const createProjectCreationClasses = (
    props: IProjectCreationProps,
    state: IProjectCreationState,
) => {
    const projectCreationContainer = css({
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    });

    const stepperContent = css({
        flexGrow: 1,
        overflowY: 'auto',
    });

    const stepperContainer = css({
        flexShrink: 0,
    });

    const actionButtonContainer = css({
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
    });

    const baseActionButton = css({
        marginLeft: 16,
    });

    const projectNameContainer = css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });

    const projectName = css({
        width: 400,
    });

    const multipleCheckpointsContainer = css({
        paddingTop: 48,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
    });

    const singleCheckpointContainer = css({
        marginBottom: 48,
        marginRight: 48,
        marginLeft: 48,
    });

    return {
        projectCreationContainer,
        stepperContainer,
        stepperContent,
        actionButtonContainer,
        baseActionButton,
        projectNameContainer,
        projectName,
        multipleCheckpointsContainer,
        singleCheckpointContainer,
    };
}