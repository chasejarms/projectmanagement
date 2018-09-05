import { css } from 'emotion';
import { IWorkflowCheckpoint } from "../../Models/workflow";

// tslint:disable-next-line:no-empty-interface
export interface IWorkflowCheckpointProps {
    workflowCheckpoint: IWorkflowCheckpoint,
}
// tslint:disable-next-line:no-empty-interface
export interface IWorkflowCheckpointState {}

export const createWorkflowCheckpointClasses = (
    props: IWorkflowCheckpointProps,
    state: IWorkflowCheckpointState,
) => {
    const workflowCheckpointContainer = css({
        display: 'flex',
        flexDirection: 'row',
        width: 800,
        marginBottom: 32,
    });

    const publicCheckpointContainer = css({
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 1,
    });

    const checkpointName = css({
        boxSizing: 'border-box',
        marginRight: 32,
        flexBasis: 240,
        flexShrink: 0,
    });

    const checkpointDescription = css({
        boxSizing: 'border-box',
        marginRight: 32,
        flexGrow: 1,
    });

    const publicText = css({
        position: 'relative',
        top: 14,
    });

    const deleteIcon = css({
        position: 'relative',
        top: 14,
        marginRight: 8,
        fontSize: 28,
        cursor: 'pointer',
        flexShrink: 0,
    });

    const nameAndDescriptionRow = css({
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8,
    });

    const customVisibilityAndDeadlineContainer = css({
        display: 'flex',
        flexDirection: 'row',
    });

    const nonTrashContainer = css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        // border: '1px solid rgba(0, 0, 0, 0.12)',
        // borderRadius: 3,
        padding: 16,
    });

    return {
        workflowCheckpointContainer,
        publicCheckpointContainer,
        checkpointName,
        checkpointDescription,
        publicText,
        deleteIcon,
        nameAndDescriptionRow,
        customVisibilityAndDeadlineContainer,
        nonTrashContainer,
    }
}