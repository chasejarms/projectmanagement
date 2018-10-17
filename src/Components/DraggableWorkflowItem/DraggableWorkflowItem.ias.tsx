import { css } from 'emotion';
import { IWorkflowCheckpoint } from '../../Models/workflow';

// tslint:disable-next-line:no-empty-interface
export interface IDraggableWorkflowItemProps {
    workflowCheckpoint: IWorkflowCheckpoint;
    index: number;
    connectDragSource: any;
}

// tslint:disable-next-line:no-empty-interface
export interface IDraggableWorkflowItemState {}

export const createDraggableWorkflowItemClasses = (
    props: IDraggableWorkflowItemProps,
    state: IDraggableWorkflowItemState,
) => {
    const checkpointNameContainer = css({
        display: 'flex',
        flexDirection: 'row',
    });

    const checkpointNameSpan = css({
        position: 'relative',
        top: 5,
    })

    return {
        checkpointNameContainer,
        checkpointNameSpan,
    };
}