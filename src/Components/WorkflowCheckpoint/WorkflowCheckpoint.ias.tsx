import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { IWorkflowCheckpoint } from "../../Models/workflow";

// tslint:disable-next-line:no-empty-interface
export interface IWorkflowCheckpointProps extends WithTheme {
    workflowCheckpoint: IWorkflowCheckpoint,
    isFirstCheckpoint?: boolean;
    greyBackground?: boolean;
}
// tslint:disable-next-line:no-empty-interface
export interface IWorkflowCheckpointState {}

export const createWorkflowCheckpointClasses = (
    props: IWorkflowCheckpointProps,
    state: IWorkflowCheckpointState,
) => {
    const actionsContainer = css({
        display: 'flex',
        flexDirection: 'column',
        transform: 'translateX(50px)',
        transition: 'all 200ms ease-in-out',
        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
        boxSizing: 'border-box',
    });

    const workflowCheckpointContainer = css({
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 24,
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        backgroundColor: 'white',
        borderRadius: 3,
        [`&:hover .action-buttons`]: {
            transform: 'translateX(0)',
            width: 'auto',
        },
        overflow: 'hidden',
    });

    const nonActionButtonContainer = css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        paddingTop: 24,
        paddingBottom: 32,
    })

    const publicCheckpointContainer = css({
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 1,
        marginRight: 20,
    });

    const checkpointName = css({
        boxSizing: 'border-box',
        marginRight: 32,
        flexGrow: 1,
    });

    const daysToCompleteStying = css({
        boxSizing: 'border-box',
        marginRight: 32,
        flexBasis: 320,
        flexShrink: 0,
    });

    const checkpointDescription = css({
        boxSizing: 'border-box',
        marginRight: 32,
        flexGrow: 1,
        flexBasis: 200,
        flexShrink: 0,
    });

    const deleteIcon = css({
        fontSize: 28,
        cursor: 'pointer',
        flexShrink: 0,
        flexGrow: 1,
        paddingRight: 8,
        paddingLeft: 8,
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    });

    const newCheckpointBeforeIcon = css({
        fontSize: 28,
        cursor: 'pointer',
        flexShrink: 0,
        flexGrow: 1,
        paddingRight: 8,
        paddingLeft: 8,
    });

    const newCheckpointAfterIcon = css({
        fontSize: 28,
        cursor: 'pointer',
        flexShrink: 0,
        flexGrow: 1,
        paddingRight: 8,
        paddingLeft: 8,
        borderBottomRightRadius: 3,
    });

    const publicText = css({
        position: 'relative',
        top: 14,
        fontSize: '1rem !important',
    });

    const nameAndDescriptionRow = css({
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8,
    });

    const customVisibilityAndDeadlineContainer = css({
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        top: 7,
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
        daysToCompleteStying,
        actionsContainer,
        nonActionButtonContainer,
        newCheckpointAfterIcon,
        newCheckpointBeforeIcon,
    }
}