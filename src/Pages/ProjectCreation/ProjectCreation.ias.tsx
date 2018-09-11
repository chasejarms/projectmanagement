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
    open: boolean;
    user: any;
    checkpointStatus: any;
    role: any;
    additionalCheckpoints: Set<string>;
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

    const paper = css({
        marginBottom: 32,
    });

    const usersContainer = css({
        padding: 32,
    });

    const addedUserRow = css({
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f5f5f5'
        },
    })

    const fabButton = css({
        position: 'absolute',
        bottom: 16,
        right: 16,
    });

    const dialogControl = css({
        marginBottom: 16,
        minWidth: 500,
    });

    const dialogContent = css({
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
    });

    const dialogRow = css({
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 16,
    });

    const dialogRowFirstItem = css({
        width: 'calc(50% - 8px)',
        marginRight: 16,
        display: 'inline-block',
    })

    const dialogRowSecondItem = css({
        width: 'calc(50% - 8px)',
        display: 'inline-block',
    });

    const selectControl = css({
        width: '100%',
    });

    const addedItemContainer = css({
        height: 32,
        display: 'flex',
        flexDirection: 'row',
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
        topBar,
        paper,
        usersContainer,
        addedUserRow,
        fabButton,
        dialogControl,
        dialogContent,
        dialogRow,
        dialogRowFirstItem,
        dialogRowSecondItem,
        selectControl,
        addedItemContainer,
    };
}