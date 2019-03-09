import {
    Button,
    Drawer,
    Typography,
} from '@material-ui/core';
import * as React from 'react';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { IPrescriptionSectionTemplateType } from 'src/Models/prescription/sections/prescriptionSectionTemplateType';
import { DraggableFormElement } from '../DraggableFormElement/DraggableFormElement';
import { createPrescriptionBuilderDrawerClasses, IPrescriptionBuilderDrawerProps, IPrescriptionBuilderDrawerState } from './PrescriptionBuilderDrawer.ias';

export class PrescriptionBuilderDrawer extends React.Component<
    IPrescriptionBuilderDrawerProps,
    IPrescriptionBuilderDrawerState
> {
    public render() {
        const {
            drawerPaper,
            drawerInnerContainer,
            drawerTitleContainer,
            draggableIconsContainer,
            editModeButtonContainer,
        } = createPrescriptionBuilderDrawerClasses(this.props, this.state);

        // const shouldDisableDrag = this.state.loadingPrescriptionTemplate || this.state.updatingPrescriptionTemplate || !this.state.editMode;
        const shouldDisableDrag = false;

        return (
            <Drawer
                open={true}
                variant="persistent"
                anchor="right"
                classes={{
                    paper: drawerPaper,
                }}
            >
                <div className={drawerInnerContainer}>
                    <div>
                        <div className={drawerTitleContainer}>
                            <Typography variant="title">Sections</Typography>
                        </div>
                        <div className={draggableIconsContainer}>
                            <DraggableFormElement sectionType={IPrescriptionSectionTemplateType.Regular} disableDrag={shouldDisableDrag}/>
                            {/* <DraggableFormElement sectionType={IPrescriptionSectionTemplateType.Duplicatable}/>
                            <DraggableFormElement sectionType={IPrescriptionSectionTemplateType.Advanced}/> */}
                        </div>
                        <div className={drawerTitleContainer}>
                            <Typography variant="title">Elements</Typography>
                        </div>
                        <div className={draggableIconsContainer}>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Checkbox} disableDrag={shouldDisableDrag}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Date} disableDrag={shouldDisableDrag}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.NonEditableText} disableDrag={shouldDisableDrag}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.DoctorInformation} disableDrag={shouldDisableDrag}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Dropdown} disableDrag={shouldDisableDrag}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.MultilineText} disableDrag={shouldDisableDrag}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Number} disableDrag={shouldDisableDrag}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.SingleLineText} disableDrag={shouldDisableDrag}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Title} disableDrag={shouldDisableDrag}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.UnitSelection} disableDrag={shouldDisableDrag}/>
                        </div>
                    </div>
                    <div className={editModeButtonContainer}>
                        <Button
                            // disabled={this.state.loadingPrescriptionTemplate || this.state.updatingPrescriptionTemplate}
                            // onClick={this.toggleEditMode}
                            color="secondary">
                            {true/*this.state.editMode*/ ? 'Switch To View Mode' : 'Switch To Edit Mode'}
                        </Button>
                    </div>
                </div>
            </Drawer>
        )
    }
}