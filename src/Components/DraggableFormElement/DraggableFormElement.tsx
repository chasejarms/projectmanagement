import { Typography } from '@material-ui/core';
import UnitSelectionIcon from '@material-ui/icons/Apps';
import DropdownIcon from '@material-ui/icons/ArrowDropDown';
import DateIcon from '@material-ui/icons/CalendarToday';
import CheckboxIcon from '@material-ui/icons/CheckBox';
import DescriptionIcon from '@material-ui/icons/Description';
import NumberIcon from '@material-ui/icons/ExposurePlus1';
import NotePadIcon from '@material-ui/icons/Notes';
import PersonIcon from '@material-ui/icons/Person';
import TextIcon from '@material-ui/icons/TextFields';
import TitleIcon from '@material-ui/icons/Title';
import SectionIcon from '@material-ui/icons/ViewAgenda';
import * as React from 'react';
import { DragSource, DragSourceCollector, DragSourceConnector, DragSourceMonitor } from 'react-dnd';
import { IDraggableTypes } from 'src/Models/draggableTypes';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { IPrescriptionSectionTemplateType } from 'src/Models/prescription/sections/prescriptionSectionTemplateType';
import { createDraggableFormElementClasses, IDraggableFormElementCollectorProps, IDraggableFormElementProps, IDraggableFormElementPropsFromParentComponent, IDraggableFormElementState } from './DraggableFormElement.ias';

const draggableFormElementSource = {
    beginDrag(props: IDraggableFormElementPropsFromParentComponent) {
        const type = props.controlType || props.sectionType;
        const isSection = !!props.sectionType;
        return {
            type,
            isSection,
        };
    },
}

const collect: DragSourceCollector<IDraggableFormElementCollectorProps> = (
    connect: DragSourceConnector,
    monitor: DragSourceMonitor,
) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

const invalidControlTypeError = 'The passed in control type was not valid.';
const invalidSectionTypeError = 'The passed in section type was not valid.';

export class DraggableFormElementPresentation extends React.Component<
    IDraggableFormElementProps,
    IDraggableFormElementState
> {
    public render() {
        const {
            draggableIconContainer,
        } = createDraggableFormElementClasses(this.props, this.state);

        const {
            connectDragSource,
        } = this.props;

        return connectDragSource(
            <div className={draggableIconContainer}>
                {this.correctIcon()}
                <Typography variant="caption" align="center">
                    {this.correctText()}
                </Typography>
            </div>
        )
    }

    private correctIcon= () => {
        if (this.props.controlType) {
            switch (this.props.controlType) {
                case IPrescriptionControlTemplateType.Checkbox:
                    return <CheckboxIcon/>;
                case IPrescriptionControlTemplateType.Date:
                    return <DateIcon/>;
                case IPrescriptionControlTemplateType.DoctorInformation:
                    return <PersonIcon/>;
                case IPrescriptionControlTemplateType.Dropdown:
                    return <DropdownIcon/>;
                case IPrescriptionControlTemplateType.MultilineText:
                    return <NotePadIcon/>;
                case IPrescriptionControlTemplateType.NonEditableText:
                    return <DescriptionIcon/>;
                case IPrescriptionControlTemplateType.Number:
                    return <NumberIcon/>;
                case IPrescriptionControlTemplateType.SingleLineText:
                    return <TextIcon/>;
                case IPrescriptionControlTemplateType.Title:
                    return <TitleIcon/>;
                case IPrescriptionControlTemplateType.UnitSelection:
                    return <UnitSelectionIcon/>;
                default:
                    throw new Error(invalidControlTypeError);
            }
        } else {
            switch (this.props.sectionType) {
                case IPrescriptionSectionTemplateType.Regular:
                    return <SectionIcon/>;
                case IPrescriptionSectionTemplateType.Duplicatable:
                    return <SectionIcon/>;
                case IPrescriptionSectionTemplateType.Advanced:
                    return <SectionIcon/>;
                default:
                    throw new Error(invalidSectionTypeError);
            }
        }
    }

    private correctText = () => {
        if (this.props.controlType) {
            switch (this.props.controlType) {
                case IPrescriptionControlTemplateType.Checkbox:
                    return 'Checkbox';
                case IPrescriptionControlTemplateType.Date:
                    return 'Date'
                case IPrescriptionControlTemplateType.DoctorInformation:
                    return 'Doctor Information';
                case IPrescriptionControlTemplateType.Dropdown:
                    return 'Dropdown';
                case IPrescriptionControlTemplateType.MultilineText:
                    return 'Notepad';
                case IPrescriptionControlTemplateType.NonEditableText:
                    return 'Description';
                case IPrescriptionControlTemplateType.Number:
                    return 'Number';
                case IPrescriptionControlTemplateType.SingleLineText:
                    return 'Text';
                case IPrescriptionControlTemplateType.Title:
                    return 'Title';
                case IPrescriptionControlTemplateType.UnitSelection:
                    return 'Unit Selection';
                default:
                    throw new Error(invalidControlTypeError);
            }
        } else {
            switch (this.props.sectionType) {
                case IPrescriptionSectionTemplateType.Regular:
                    return 'Section';
                case IPrescriptionSectionTemplateType.Duplicatable:
                    return 'Duplicatable Section';
                case IPrescriptionSectionTemplateType.Advanced:
                    return 'Advanced Section';
                default:
                    throw new Error(invalidSectionTypeError);
            }
        }
    }
}

export const DraggableFormElement = DragSource(
    IDraggableTypes.PrescriptionBuilder,
    draggableFormElementSource,
    collect,
)(DraggableFormElementPresentation) as any;