import { css } from 'emotion';
import { RouteComponentProps } from "react-router";

export interface IWorkflowPresentationProps extends RouteComponentProps<{}> {}

// tslint:disable-next-line:no-empty-interface
export interface IWorkflowPresentationState {}

export const createWorkflowPresentationClasses = (
    props: IWorkflowPresentationProps,
    state: IWorkflowPresentationState,
) => {
    const workflowContainer = css({
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    });

    return {
        workflowContainer,
    }
}