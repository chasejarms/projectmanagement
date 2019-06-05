import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface IWorkflowsProps {}
// tslint:disable-next-line:no-empty-interface
export interface IWorkflowsState {}

export const createWorkflowsClasses = (
    props: IWorkflowsProps,
    state: IWorkflowsState,
) => {
    const workflowsContainer = css({
        height: '100vh',
        padding: 32,
        boxSizing: 'border-box',
    });

    const workflowsPaper = css({
        overflowY: 'auto',
    });

    const workflowsToolbarContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    });

    return {
        workflowsContainer,
        workflowsPaper,
        workflowsToolbarContainer,
    };
}