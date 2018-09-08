import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { IWorkflowCheckpoint } from '../../Models/workflow';

// tslint:disable-next-line:no-empty-interface
export interface IProjectCreationProps extends WithTheme {}
// tslint:disable-next-line:no-empty-interface
export interface IProjectCreationState {
    activeStep: number;
    projectName: string;
    checkpoints: IWorkflowCheckpoint[];
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
        flexGrow: 1,
    });

    const actionButtonContainer = css({
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        flexBasis: 300,
    });

    const baseActionButton = css({
        marginLeft: 16,
        paddingLeft: 24,
        paddingRight: 24,
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

    const topBar = css({
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 0,
    });

    const addUsersContainer = css({
        display: 'flex',
        flexDirection: 'column',
    });

    const userSearchContainer = css({
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        padding: 32,
    });

    const addedUsersContainer = css({
        paddingLeft: 32,
        paddingRight: 32,
        paddingBottom: 32,
        flexShrink: 0,
    });

    const textFieldContainer = css({
        paddingBottom: 32,
    });

    const paper = css({
        marginBottom: 32,
    });

    const searchTextField = css({
        width: '400px',
    });

    const addedUsersText = css({
        marginBottom: 32,
    });

    const icon = css({
        cursor: 'pointer',
    })

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
        topBar,
        userSearchContainer,
        addedUsersContainer,
        addUsersContainer,
        textFieldContainer,
        paper,
        searchTextField,
        addedUsersText,
        icon,
    };
}