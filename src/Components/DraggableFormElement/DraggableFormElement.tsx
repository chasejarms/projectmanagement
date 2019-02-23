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
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { createDraggableFormElementClasses, IDraggableFormElementProps, IDraggableFormElementState } from './DraggableFormElement.ias';

export class DraggableFormElement extends React.Component<
    IDraggableFormElementProps,
    IDraggableFormElementState
> {
    public render() {
        const {
            draggableIconContainer,
        } = createDraggableFormElementClasses(this.props, this.state);


        return (
            <div className={draggableIconContainer}>
                {this.correctIcon()}
                <Typography variant="caption" align="center">
                    {this.correctText()}
                </Typography>
            </div>
        )
    }

    private correctIcon= () => {
        switch (this.props.type) {
            case null:
                return <SectionIcon/>;
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
        }
    }

    private correctText = () => {
        switch (this.props.type) {
            case null:
                return 'Section';
            case IPrescriptionControlTemplateType.Checkbox:
                return 'Checkbox';
            case IPrescriptionControlTemplateType.Date:
                return 'Date'
            case IPrescriptionControlTemplateType.DoctorInformation:
                return 'Person';
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
        }
    }
}