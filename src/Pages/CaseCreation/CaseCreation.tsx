import {
    Paper,
    Toolbar,
    Typography,
    withTheme,
} from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { CheckboxEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/CheckboxEdit/CheckboxEdit';
import { DateEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/DateEdit/DateEdit';
import { DoctorInformationEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/DoctorInformationEdit/DoctorInformation.ias';
import { DropdownEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/DropdownEdit/DropdownEdit';
import { MultilineTextEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/MultilineTextEdit/MultilineTextEdit';
import { NonEditableText } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/NonEditableText/NonEditableText';
import { NumberEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/NumberEdit/NumberEdit';
import { SingleLineTextEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/SingleLineTextEdit/SingleLineTextEdit';
import { TitleEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/TitleEdit/TitleEdit';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { updateCaseCreationControlValue } from 'src/Redux/ActionCreators/caseCreationCreator';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import Api from '../../Api/api';
import { createCaseCreationClasses, ICaseCreationProps, ICaseCreationState } from './CaseCreation.ias';

export class CaseCreationPresentation extends React.Component<
    ICaseCreationProps,
    ICaseCreationState
> {
    public state: ICaseCreationState = {
        loadingPrescriptionTemplate: true,
        prescriptionFormTemplate: null,
    }

    public async componentWillMount(): Promise<void> {
        const companyId = this.props.match.path.split('/')[2];
        const prescriptionFormTemplate = await Api.prescriptionTemplateApi.getPrescriptionTemplate(companyId);
        this.setState({
            loadingPrescriptionTemplate: false,
            prescriptionFormTemplate,
        })
    }

    public render() {
        const {
            caseCreationContainer,
            caseCreationFormContainer,
            sectionsContainer,
            sectionContainer,
            controlContainer,
        } = createCaseCreationClasses(this.props, this.state);

        return (
            <div className={caseCreationContainer}>
                <Paper className={caseCreationFormContainer}>
                    <Toolbar>
                        <Typography variant="title">
                            Case Creation Form
                        </Typography>
                    </Toolbar>
                    {this.state.loadingPrescriptionTemplate ? (
                        <div>Loading</div>
                    ) : (
                        <div className={sectionsContainer}>
                            {this.state.prescriptionFormTemplate!.sectionOrder.map((sectionId, sectionIndex) => {
                                const sections = this.state.prescriptionFormTemplate!.sections;
                                const currentSection = sections[sectionId];
                                const controlOrderForSection = currentSection.controlOrder;
                                const noControlForSection = controlOrderForSection.length === 0;

                                if (noControlForSection) {
                                    return undefined;
                                }

                                return (
                                    <div key={sectionId} className={sectionContainer}>
                                        {controlOrderForSection.map((controlId) => {
                                            return (
                                                <div key={controlId} className={controlContainer}>
                                                    {this.correctControlDisplay(controlId)}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Paper>
            </div>
        )
    }

    private correctControlDisplay = (controlId: string) => {
        const control = this.state.prescriptionFormTemplate!.controls[controlId];
        const controlValue = this.props.caseCreationState.controlValues[control.id]

        if (control.type === IPrescriptionControlTemplateType.Title) {
            return <TitleEdit control={control}/>
        } else if (control.type === IPrescriptionControlTemplateType.Dropdown) {
            return (
                <DropdownEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateCaseCreationControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.DoctorInformation) {
            return (
                <DoctorInformationEdit
                    disabled={false}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.MultilineText) {
            return (
                <MultilineTextEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateCaseCreationControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.SingleLineText) {
            return (
                <SingleLineTextEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateCaseCreationControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.Checkbox) {
            return (
                <CheckboxEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateCaseCreationControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.Number) {
            return (
                <NumberEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateCaseCreationControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.NonEditableText) {
            return (
                <NonEditableText
                    control={control}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.Date) {
            return (
                <DateEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateCaseCreationControlValue}
                />
            )
        }

        return <div/>
    }
}

const mapStateToProps = ({ caseCreationState }: IAppState ) => ({
    caseCreationState,
})

const connectedComponent = connect(mapStateToProps)(CaseCreationPresentation);
export const CaseCreation = withRouter(withTheme()(connectedComponent as any) as any)