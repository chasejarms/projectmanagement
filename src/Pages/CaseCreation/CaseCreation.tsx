import {
    CircularProgress,
    Paper,
    Tooltip,
    Typography,
    withTheme,
} from '@material-ui/core';
import * as firebase from 'firebase';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { CaseDeadlineEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/CaseDeadlineEdit/CaseDeadlineEdit';
import { CheckboxEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/CheckboxEdit/CheckboxEdit';
import { DateEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/DateEdit/DateEdit';
import { DoctorInformationEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/DoctorInformationEdit/DoctorInformation';
import { DropdownEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/DropdownEdit/DropdownEdit';
import { FileEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/FileEdit/FileEdit';
import { MultilineTextEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/MultilineTextEdit/MultilineTextEdit';
import { NonEditableText } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/NonEditableText/NonEditableText';
import { NumberEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/NumberEdit/NumberEdit';
import { SingleLineTextEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/SingleLineTextEdit/SingleLineTextEdit';
import { TitleEdit } from 'src/Components/PrescriptionEdit/PrescriptionEditComponents/TitleEdit/TitleEdit';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { clearCaseCreationState, updateCaseCreationControlValue } from 'src/Redux/ActionCreators/caseCreationCreator';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import { generateUniqueId } from 'src/Utils/generateUniqueId';
import Api from '../../Api/api';
import { createCaseCreationClasses, IProjectCreationProps, IProjectCreationState } from './CaseCreation.ias';

export class CaseCreationPresentation extends React.Component<
    IProjectCreationProps,
    IProjectCreationState
> {
    public state: IProjectCreationState = {
        loadingPrescriptionTemplate: true,
        prescriptionFormTemplate: null,
        caseCreationInProgress: false,
        canCreateCases: false,
        projectId: generateUniqueId(),
    }

    // tslint:disable-next-line:variable-name
    private _isMounted: boolean;

    public async componentWillMount(): Promise<void> {
        this._isMounted = true;
        const companyId = this.props.match.path.split('/')[2];
        const canCreateCases = await Api.projectsApi.canCreateCases(companyId);

        // tslint:disable-next-line:no-console
        console.log(canCreateCases);

        if (!canCreateCases) {
            if (this._isMounted) {
                this.setState({
                    canCreateCases: false,
                    loadingPrescriptionTemplate: false,
                })
            }

            return;
        }

        const prescriptionFormTemplate = await Api.prescriptionTemplateApi.getPrescriptionTemplate(companyId);

        if (prescriptionFormTemplate.companyLogoURL) {
            await this.createCompanyLogoDownloadURL(prescriptionFormTemplate.companyLogoURL);
        }

        if (this._isMounted) {
            this.setState({
                loadingPrescriptionTemplate: false,
                prescriptionFormTemplate,
                canCreateCases: true,
            })
        }
    }

    public componentWillUnmount(): void {
        this._isMounted = false;
        this.props.clearCaseCreationState();
    }

    public render() {
        const {
            caseCreationContainer,
            caseCreationFormContainer,
            sectionsContainer,
            sectionContainer,
            controlContainer,
            circularProgressContainer,
            createCaseButtonContainer,
            cannotCreateCaseContainer,
            companyLogoImage,
        } = createCaseCreationClasses(this.props, this.state);

        const prescriptionTemplateIsInvalid = this.checkPrescriptionTemplateIsInvalid();

        return (
            <div className={caseCreationContainer}>
                <Paper className={caseCreationFormContainer}>
                    {this.state.loadingPrescriptionTemplate ? (
                        <div className={circularProgressContainer}>
                            <CircularProgress
                                color="primary"
                                size={64}
                                thickness={3}
                            />
                        </div>
                    ) : undefined}
                    {this.state.canCreateCases && !this.state.loadingPrescriptionTemplate ? (
                        <div className={sectionsContainer}>
                            {this.state.companyLogoDownloadURL ? (
                                <div>
                                    <img src={this.state.companyLogoDownloadURL} className={companyLogoImage}/>
                                </div>
                            ) : undefined}
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
                    ) : undefined}
                    {!this.state.loadingPrescriptionTemplate && this.state.canCreateCases ? (
                        <div className={createCaseButtonContainer}>
                            <Tooltip
                                title="Doctor Information and Case Deadline are required fields"
                                placement="left"
                                disableFocusListener={!prescriptionTemplateIsInvalid}
                                disableHoverListener={!prescriptionTemplateIsInvalid}
                                disableTouchListener={!prescriptionTemplateIsInvalid}
                            >
                                <span>
                                    <AsyncButton
                                        color="secondary"
                                        disabled={prescriptionTemplateIsInvalid || this.state.caseCreationInProgress}
                                        asyncActionInProgress={this.state.caseCreationInProgress}
                                        onClick={this.createCase}>
                                        Create Case
                                    </AsyncButton>
                                </span>
                            </Tooltip>
                        </div>
                    ) : undefined}
                    {!this.state.canCreateCases && !this.state.loadingPrescriptionTemplate ? (
                        <div className={cannotCreateCaseContainer}>
                            <div>
                                <Typography variant="headline">
                                    Before creating any cases, make sure the following checklist is met:
                                </Typography>
                                <ul>
                                    <li>
                                        <Typography variant="subheading">At least one doctor has been added to the system.</Typography>
                                    </li>
                                    <li>
                                        <Typography variant="subheading">At least one checkpoint is part of the company workflow.</Typography>
                                    </li>
                                    <li>
                                        <Typography variant="subheading">The prescription template includes a case deadline field and a doctor information field.</Typography>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : undefined}
                </Paper>
            </div>
        )
    }

    private createCompanyLogoDownloadURL = async(companyLogoURL: string) => {
        const storageRef = firebase.storage().ref();
        const companyLogoDownloadURL = await storageRef.child(companyLogoURL).getDownloadURL();

        if (this._isMounted) {
            this.setState({
                companyLogoDownloadURL,
            });
        }
    }

    private checkPrescriptionTemplateIsInvalid = () => {
        if (this.state.loadingPrescriptionTemplate || !this.state.canCreateCases) {
            return true;
        }

        let doctorInformationHasValue: boolean = false;
        let caseDeadlineHasValue: boolean = false;

        this.state.prescriptionFormTemplate!.sectionOrder.forEach((sectionId) => {
            const section = this.state.prescriptionFormTemplate!.sections[sectionId];
            section.controlOrder.forEach((controlId) => {
                const control = this.state.prescriptionFormTemplate!.controls[controlId];
                const controlValueExists = !!this.props.caseCreationState.controlValues[control.id]
                if (control.type === IPrescriptionControlTemplateType.DoctorInformation) {
                    doctorInformationHasValue = controlValueExists;
                } else if (control.type === IPrescriptionControlTemplateType.CaseDeadline) {
                    caseDeadlineHasValue = controlValueExists;
                }
            })
        });

        return !doctorInformationHasValue || !caseDeadlineHasValue;
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
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateCaseCreationControlValue}
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
        } else if (control.type === IPrescriptionControlTemplateType.CaseDeadline) {
            return (
                <CaseDeadlineEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateCaseCreationControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.File) {
            return (
                <FileEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateCaseCreationControlValue}
                    projectId={this.state.projectId}
                />
            )
        }

        return <div/>
    }

    private createCase = async() => {
        const companyId = this.props.match.path.split('/')[2];
        const caseCreateRequest = {
            id: this.state.projectId,
            prescriptionTemplateId: this.state.prescriptionFormTemplate!.id!,
            controlValues: this.props.caseCreationState.controlValues,
        }

        if (this._isMounted) {
            this.setState({
                caseCreationInProgress: true,
            })
        }

        await Api.projectsApi.createProject(companyId, caseCreateRequest);

        if (this._isMounted) {
            this.setState({
                caseCreationInProgress: false,
            })
        }

        const postRoute = `/company/${companyId}/project/${this.state.projectId}`;
        this.props.history.push(postRoute);
    }
}

const mapStateToProps = ({ caseCreationState }: IAppState ) => ({
    caseCreationState,
})

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
    clearCaseCreationState: () => {
        const clearCaseCreationAction = clearCaseCreationState();
        dispatch(clearCaseCreationAction);
    },
});


const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(CaseCreationPresentation);
export const CaseCreation = withRouter(withTheme()(connectedComponent as any) as any)