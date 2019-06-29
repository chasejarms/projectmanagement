import {
    Button,
    Drawer,
    Typography,
} from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { IPrescriptionSectionTemplateType } from 'src/Models/prescription/sections/prescriptionSectionTemplateType';
import { setEditMode, setViewMode } from 'src/Redux/ActionCreators/prescriptionBuilderCreators';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import { DraggableFormElement } from '../DraggableFormElement/DraggableFormElement';
import { createPrescriptionBuilderDrawerClasses, IPrescriptionBuilderDrawerProps, IPrescriptionBuilderDrawerState } from './PrescriptionBuilderDrawer.ias';

class PrescriptionBuilderDrawerPresentation extends React.Component<
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

        const { editMode } = this.props.prescriptionBuilderState;
        const shouldDisable = this.props.disableEdits || !editMode;
        const caseDeadlineAlreadyExists = this.controlAlreadyExists(IPrescriptionControlTemplateType.CaseDeadline);
        const doctorInformationAlreadyExists = this.controlAlreadyExists(IPrescriptionControlTemplateType.DoctorInformation);
        const patientNameAlreadyExists = this.controlAlreadyExists(IPrescriptionControlTemplateType.PatientName);

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
                            <DraggableFormElement sectionType={IPrescriptionSectionTemplateType.Regular} disableDrag={shouldDisable}/>
                            {/* <DraggableFormElement sectionType={IPrescriptionSectionTemplateType.Duplicatable}/>
                            <DraggableFormElement sectionType={IPrescriptionSectionTemplateType.Advanced}/> */}
                        </div>
                        <div className={drawerTitleContainer}>
                            <Typography variant="title">Elements</Typography>
                        </div>
                        <div className={draggableIconsContainer}>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Checkbox} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Date} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.NonEditableText} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.DoctorInformation} disableDrag={shouldDisable || doctorInformationAlreadyExists}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Dropdown} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.MultilineText} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Number} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.SingleLineText} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Title} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.CaseDeadline} disableDrag={shouldDisable || caseDeadlineAlreadyExists}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.File} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.PatientName} disableDrag={shouldDisable || patientNameAlreadyExists}/>
                            {/* <DraggableFormElement controlType={IPrescriptionControlTemplateType.UnitSelection} disableDrag={shouldDisable}/> */}
                        </div>
                    </div>
                    <div className={editModeButtonContainer}>
                        <Button
                            disabled={this.props.disableEdits}
                            onClick={this.toggleEditMode}
                            color="secondary">
                            {editMode ? 'Switch To View Mode' : 'Switch To Edit Mode'}
                        </Button>
                    </div>
                </div>
            </Drawer>
        )
    }

    private controlAlreadyExists = (controlType: IPrescriptionControlTemplateType) => {
        return this.props.prescriptionBuilderState.prescriptionFormTemplate.sectionOrder.some((sectionId) => {
            const section = this.props.prescriptionBuilderState.prescriptionFormTemplate.sections[sectionId];
            return section.controlOrder.some((controlId) => {
                const control = this.props.prescriptionBuilderState.prescriptionFormTemplate.controls[controlId];
                return control.type === controlType;
            });
        })
    }

    private toggleEditMode = () => {
        const { editMode } = this.props.prescriptionBuilderState;
        if (editMode) {
            this.props.setViewMode();
        } else {
            this.props.setEditMode();
        }
    }
}

const mapStateToProps = ({ prescriptionBuilderState }: IAppState) => ({
    prescriptionBuilderState,
});

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
    setViewMode: () => {
        const setViewModeAction = setViewMode();
        dispatch(setViewModeAction);
    },
    setEditMode: () => {
        const setEditModeAction = setEditMode();
        dispatch(setEditModeAction);
    }
});


const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(PrescriptionBuilderDrawerPresentation);
export const PrescriptionBuilderDrawer = withRouter(connectedComponent) as any;