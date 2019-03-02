import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import * as React from 'react';
import {
    DragSource,
    DragSourceCollector,
    DragSourceConnector,
    DragSourceMonitor,
} from 'react-dnd';
import { IDraggableTypes } from 'src/Models/draggableTypes';
import {
    IDraggableExistingFormElementCollectorProps,
    IDraggableExistingFormElementProps,
    IDraggableExistingFormElementPropsFromParentComponent,
    IDraggableExistingFormElementState,
} from './DraggableExistingFormElement.ias';

const draggableExistingFormElementSource = {
    beginDrag(props: IDraggableExistingFormElementPropsFromParentComponent) {
        const type = props.controlType || props.sectionType;
        const isSection = !!props.sectionType;
        const id = props.id;
        return {
            type,
            isSection,
            id,
        }
    }
}

const collect: DragSourceCollector<IDraggableExistingFormElementCollectorProps> = (
    connect: DragSourceConnector,
    monitor: DragSourceMonitor,
) => {
    return {
        connectDragSource: connect.dragSource(),
    }
}

export class DraggableExistingFormElementPresentation extends React.Component<
    IDraggableExistingFormElementProps,
    IDraggableExistingFormElementState
> {
    public render() {
        const {
            connectDragSource,
        } = this.props;

        return connectDragSource(
            <div>
                <DragIndicatorIcon/>
            </div>
        )
    }
}

export const DraggableExistingFormElement = DragSource(
    IDraggableTypes.PrescriptionBuilder,
    draggableExistingFormElementSource,
    collect,
)(DraggableExistingFormElementPresentation) as any