import { withTheme } from '@material-ui/core';
import * as React from 'react';
import { DropTarget, DropTargetCollector, DropTargetSpec } from 'react-dnd';
import {
    createDroppableWorkflowRowClasses,
    IDroppableWorkflowRowProps,
    IDroppableWorkflowRowState,
} from './DroppableWorkflowRow.ias';

const dropTargetSpec: DropTargetSpec<{}> = {}

const dropTargetCollector: DropTargetCollector<{}> = (connect: any, monitor: any) => {
    return {
        connectDropToTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    };
}

export class DroppableWorkflowRowPresentation extends React.Component<IDroppableWorkflowRowProps, IDroppableWorkflowRowState> {
    public state: IDroppableWorkflowRowState = {
        isHover: false,
    }

    public render() {
        const {
            droppableWorkflowRowClass,
            tableDataClass,
            tableDataContainer,
        } = createDroppableWorkflowRowClasses(this.props, this.state);

        return this.props.connectDropToTarget(
            <tr className={droppableWorkflowRowClass}>
                <td className={tableDataContainer}>
                    <div className={tableDataClass}/>
                </td>
                <td>
                    <div className={tableDataClass}/>
                </td>
                <td>
                    <div className={tableDataClass}/>
                </td>
                <td>
                    <div className={tableDataClass}/>
                </td>
            </tr>
        )
    }
}

export const DroppableWorkflowRow = DropTarget('WorkflowItem', dropTargetSpec, dropTargetCollector)(withTheme()(DroppableWorkflowRowPresentation));