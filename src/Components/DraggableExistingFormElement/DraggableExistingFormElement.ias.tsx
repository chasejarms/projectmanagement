import { ConnectDragSource } from 'react-dnd';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { IPrescriptionSectionTemplateType } from 'src/Models/prescription/sections/prescriptionSectionTemplateType';

export interface IDraggableExistingFormElementProps extends IDraggableExistingFormElementPropsFromParentComponent, IDraggableExistingFormElementCollectorProps {}
// tslint:disable-next-line:no-empty-interface
export interface IDraggableExistingFormElementState {}

export interface IDraggableExistingFormElementPropsFromParentComponent {
    controlType?: IPrescriptionControlTemplateType;
    sectionType?: IPrescriptionSectionTemplateType;
    id: string;
}

export interface IDraggableExistingFormElementCollectorProps {
    connectDragSource: ConnectDragSource;
}

export const createExistingDraggableFormElementClasses = (
    props: IDraggableExistingFormElementProps,
    state: IDraggableExistingFormElementState,
) => {
    return {};
}