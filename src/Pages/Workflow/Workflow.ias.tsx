import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from "react-router";
import { IWorkflow } from '../../Models/workflow';

export interface IWorkflowPresentationProps extends RouteComponentProps<{}>, WithTheme {
    connectDragSource: any;
    isDragging: boolean;
}

// tslint:disable-next-line:no-empty-interface
export interface IWorkflowPresentationState {
    open: boolean;
    checkpointName: string;
    checkpointDescription: string;
    checkpointDays: number;
    workflow: IWorkflow | undefined;
    isUpdate: boolean;
    index: number;
}

export const createWorkflowPresentationClasses = (
    props: IWorkflowPresentationProps,
    state: IWorkflowPresentationState,
) => {
    const workflowContainer = css({
        // minHeight: '100vh',
        // boxSizing: 'content-box',
        // paddingTop: 48,
        // display: 'flex',
        // flexDirection: 'column',
        // backgroundColor: '#f5f5f5'
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
    }
}