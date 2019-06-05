import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IWorkflow } from 'src/Models/workflow';

// tslint:disable-next-line:no-empty-interface
export interface IWorkflowsProps extends RouteComponentProps<any> {}
// tslint:disable-next-line:no-empty-interface
export interface IWorkflowsState {
    workflows: IWorkflow[];
}

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

    const workflowRow = css({
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f5f5f5'
        },
    });

    return {
        workflowsContainer,
        workflowsPaper,
        workflowsToolbarContainer,
        workflowRow,
    };
}