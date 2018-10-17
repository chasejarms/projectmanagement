import {
    TableCell,
    TableRow,
} from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import * as React from 'react';
import {
    createDraggableWorkflowItemClasses,
    IDraggableWorkflowItemProps,
    IDraggableWorkflowItemState,
} from './DraggableWorkflowItem.ias';

import { DragSource, DragSourceCollector, DragSourceSpec } from 'react-dnd';

const spec: DragSourceSpec<{}, {}> = {
    beginDrag: (props: any, monitor: any, component: any) => {
        return {
            index: props.index,
        }
    }
}

const collect: DragSourceCollector<any> = (connect: any, monitor: any) => {
    return {
        connectDragSource: connect.dragSource(),
        isDraggin: monitor.isDragging(),
    }
}

export class DraggableWorkflowItemPresentation extends React.Component<IDraggableWorkflowItemProps, IDraggableWorkflowItemState> {
    public render() {
        const {
            checkpointNameContainer,
            checkpointNameSpan,
        } = createDraggableWorkflowItemClasses(this.props, this.state);

        const checkpoint = this.props.workflowCheckpoint;
        const checkpointName = (
            <div className={checkpointNameContainer}>
                <DragIndicatorIcon/>
                <span className={checkpointNameSpan}>{checkpoint.name}</span>
            </div>
        )
        return (
            // key={index} onClick={this.openCheckpointDialog(checkpoint, index)} className={workflowRow}
            <TableRow key={this.props.index}>
                <TableCell>
                    {this.props.connectDragSource(
                        checkpointName,
                    )}
                </TableCell>
                <TableCell>{checkpoint.deadlineFromLastCheckpoint}</TableCell>
                <TableCell>{checkpoint.description}</TableCell>
                <TableCell/>
            </TableRow>
        )
    }
}

export const DraggableWorkflowItem = DragSource('WorkflowItem', spec, collect)(DraggableWorkflowItemPresentation)