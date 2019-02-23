import { css } from 'emotion';
import { ConnectDragSource } from 'react-dnd';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';

// tslint:disable-next-line:no-empty-interface
export interface IDraggableFormElementProps extends IDraggableFormElementCollectorProps {
    type: IPrescriptionControlTemplateType | null;
}
// tslint:disable-next-line:no-empty-interface
export interface IDraggableFormElementState {}

export interface IDraggableFormElementCollectorProps {
    connectDragSource: ConnectDragSource;
    isDragging: boolean;
}

export const createDraggableFormElementClasses = (
    props: IDraggableFormElementProps,
    state: IDraggableFormElementState,
) => {
    const draggableIconContainer = css({
        borderRadius: 3,
        backgroundColor: '#ffffff',
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2)',
        '&:hover': {
            boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
            cursor: 'pointer',
        },
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
    })

    return {
        draggableIconContainer,
    };
}