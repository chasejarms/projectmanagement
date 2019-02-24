import { Typography, withTheme } from '@material-ui/core';
import * as React from 'react';
import { DropTarget, DropTargetCollector } from 'react-dnd';
import { IDraggableTypes } from 'src/Models/draggableTypes';
import { createFormElementDropZoneClasses, IFormElementDropZoneDropTargetCollectorProps, IFormElementDropZoneProps, IFormElementDropZonePropsFromParentComponent, IFormElementDropZoneState } from './FormElementDropZone.ias';

const formElementDropZoneTarget = {
    drop(props: IFormElementDropZonePropsFromParentComponent) {
        props.onDrop();
    }
}

const collect: DropTargetCollector<IFormElementDropZoneDropTargetCollectorProps> = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        dragActionInProgress: monitor.canDrop(),
    }
}

class FormElementDropZonePresentation extends React.Component<
    IFormElementDropZoneProps,
    IFormElementDropZoneState
> {
    public render() {
        const {
            connectDropTarget,
        } = this.props;

        const {
            dropTargetClass,
        } = createFormElementDropZoneClasses(this.props, this.state);

        return connectDropTarget(
            <div className={dropTargetClass}>
                {this.props.text ? (
                    <Typography variant="body1">{this.props.text}</Typography>
                ) : undefined}
            </div>
        )
    }
}

export const FormElementDropZone = DropTarget(
    IDraggableTypes.PrescriptionBuilder,
    formElementDropZoneTarget,
    collect,
)(withTheme()(FormElementDropZonePresentation));