import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from "react-router";

export interface IWorkflowPresentationProps extends RouteComponentProps<{}>, WithTheme {

}

// tslint:disable-next-line:no-empty-interface
export interface IWorkflowPresentationState {}

export const createWorkflowPresentationClasses = (
    props: IWorkflowPresentationProps,
    state: IWorkflowPresentationState,
) => {
    const workflowContainer = css({
        minHeight: '100vh',
        boxSizing: 'content-box',
        paddingTop: 48,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
    });

    const workflowCheckpointContainer = css({
        marginBottom: 48,
        marginRight: 48,
        marginLeft: 48,
    });

    return {
        workflowContainer,
        workflowCheckpointContainer,
    }
}