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
    public componentWillMount(): void {
        const companyId = this.props.location.pathname.split('/')[2];
        this.props.setEditMode(companyId);
    }

    public render() {
        const companyId = this.props.location.pathname.split('/')[2];
        const prescriptionBuilderSliceOfStateExists = this.props.prescriptionBuilderState[companyId];

        if (!prescriptionBuilderSliceOfStateExists) {
            return <div/>
        }

        const {
            drawerPaper,
            drawerInnerContainer,
            drawerTitleContainer,
            draggableIconsContainer,
            editModeButtonContainer,
        } = createPrescriptionBuilderDrawerClasses(this.props, this.state);

        const isEditMode = this.props.prescriptionBuilderState[companyId].editMode;
        const shouldDisable = this.props.disableEdits || !isEditMode;

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
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.DoctorInformation} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Dropdown} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.MultilineText} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Number} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.SingleLineText} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.Title} disableDrag={shouldDisable}/>
                            <DraggableFormElement controlType={IPrescriptionControlTemplateType.UnitSelection} disableDrag={shouldDisable}/>
                        </div>
                    </div>
                    <div className={editModeButtonContainer}>
                        <Button
                            onClick={this.toggleEditMode}
                            color="secondary">
                            {isEditMode ? 'Switch To View Mode' : 'Switch To Edit Mode'}
                        </Button>
                    </div>
                </div>
            </Drawer>
        )
    }

    private toggleEditMode = () => {
        const companyId = this.props.location.pathname.split('/')[2];
        const isEditMode = this.props.prescriptionBuilderState[companyId].editMode
        this.props.toggleEditMode(companyId, isEditMode);
    }
}

const mapStateToProps = ({ prescriptionBuilderState }: IAppState) => ({
    prescriptionBuilderState,
});

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
    toggleEditMode: (companyId: string, isCurrentlyEditMode: boolean) => {
        if (isCurrentlyEditMode) {
            const setViewModeAction = setViewMode(companyId);
            dispatch(setViewModeAction);
        } else {
            const setEditModeAction = setEditMode(companyId);
            dispatch(setEditModeAction);
        }
    },
    setViewMode: (companyId: string) => {
        const setViewModeAction = setViewMode(companyId);
        dispatch(setViewModeAction);
    },
    setEditMode: (companyId: string) => {
        const setEditModeAction = setEditMode(companyId);
        dispatch(setEditModeAction);
    }
});


const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(PrescriptionBuilderDrawerPresentation);
export const PrescriptionBuilderDrawer = withRouter(connectedComponent);