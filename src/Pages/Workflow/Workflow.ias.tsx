import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from "react-router";
import { FormControlState } from '../../Classes/formControlState';
import { IWorkflow } from '../../Models/workflow';

export interface IWorkflowPresentationProps extends RouteComponentProps<{}>, WithTheme {

}

// tslint:disable-next-line:no-empty-interface
export interface IWorkflowPresentationState {
    open: boolean;
    checkpointName: FormControlState<string>;
    checkpointDescription: string;
    estimatedCompletionTime: FormControlState<string>;
    visibleToDoctor: boolean;
    workflow: IWorkflow;
    isUpdate: boolean;
    checkpointId: string;
    removingWorkflowCheckpoint: boolean;
    addingOrUpdatingCheckpoint: boolean;
}

export const createWorkflowPresentationClasses = (
    props: IWorkflowPresentationProps,
    state: IWorkflowPresentationState,
) => {
    const loadingContainer = css({
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    });

    const workflowContainer = css({
        padding: 32,
    });

    const workflowCheckpointContainer = css({
        marginBottom: 48,
        marginRight: 48,
        marginLeft: 48,
    });

    const fabButton = css({
        position: 'absolute',
        bottom: 16,
        right: 16,
    });

    const dialogContent = css({
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
    });

    const dialogControl = css({
        marginBottom: 16,
        minWidth: 500,
    });

    const workflowToolbar = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    })

    const workflowRow = css({
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f5f5f5'
        },
    });

    const workflowPaper = css({
        overflow: 'hidden',
    })

    return {
        workflowContainer,
        workflowCheckpointContainer,
        fabButton,
        dialogContent,
        dialogControl,
        workflowToolbar,
        workflowRow,
        workflowPaper,
        loadingContainer,
    }
}