// import {
//     Typography,
// } from '@material-ui/core';
import * as QRCode from 'qrcode.react';
import * as React from 'react';
import { IPrescriptionControlTemplateType } from 'src/Models/prescription/controls/prescriptionControlTemplateType';
import { updateExistingCaseControlValue } from 'src/Redux/ActionCreators/existingCaseActionCreators';
import { CaseDeadlineEdit } from '../PrescriptionEdit/PrescriptionEditComponents/CaseDeadlineEdit/CaseDeadlineEdit';
import { CheckboxEdit } from '../PrescriptionEdit/PrescriptionEditComponents/CheckboxEdit/CheckboxEdit';
import { DateEdit } from '../PrescriptionEdit/PrescriptionEditComponents/DateEdit/DateEdit';
import { DoctorInformationEdit } from '../PrescriptionEdit/PrescriptionEditComponents/DoctorInformationEdit/DoctorInformation';
import { DropdownEdit } from '../PrescriptionEdit/PrescriptionEditComponents/DropdownEdit/DropdownEdit';
import { MultilineTextEdit } from '../PrescriptionEdit/PrescriptionEditComponents/MultilineTextEdit/MultilineTextEdit';
import { NonEditableText } from '../PrescriptionEdit/PrescriptionEditComponents/NonEditableText/NonEditableText';
import { NumberEdit } from '../PrescriptionEdit/PrescriptionEditComponents/NumberEdit/NumberEdit';
import { SingleLineTextEdit } from '../PrescriptionEdit/PrescriptionEditComponents/SingleLineTextEdit/SingleLineTextEdit';
import { TitleEdit } from '../PrescriptionEdit/PrescriptionEditComponents/TitleEdit/TitleEdit';
import './QRCodeDisplay.css';
import { createQRCodeDisplayClasses, IQRCodeDisplayProps, IQRCodeDisplayState } from './QRCodeDisplay.ias';

export class QRCodeDisplay extends React.Component<IQRCodeDisplayProps, IQRCodeDisplayState> {
    public render() {
        const {
            printableCaseInfoContainer,
            qrCodeContainer,
            sectionContainer,
            controlContainer,
        } = createQRCodeDisplayClasses(
            this.props,
            this.state,
        )

        return (
            <div className={`${printableCaseInfoContainer} qr-code-display`}>
                <div className={qrCodeContainer}>
                    <QRCode
                        value={this.props.caseId}
                        size={64}
                    />
                </div>
                <div>
                    {this.props.prescriptionFormTemplate.sectionOrder.map((sectionId, sectionIndex) => {
                        const sections = this.props.prescriptionFormTemplate!.sections;
                        const currentSection = sections[sectionId];
                        const controlOrderForSection = currentSection.controlOrder;
                        const noControlForSection = controlOrderForSection.length === 0;

                        if (noControlForSection) {
                            return undefined;
                        }

                        const sectionContainerClasses = `${sectionContainer} section-container-qr-code-display`
                        return (
                            <div key={sectionId} className={sectionContainerClasses}>
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
            </div>
        )
    }

    private correctControlDisplay = (controlId: string) => {
        const control = this.props.prescriptionFormTemplate!.controls[controlId];
        const controlValue = this.props.controlValues[control.id]

        if (control.type === IPrescriptionControlTemplateType.Title) {
            return <TitleEdit control={control}/>
        } else if (control.type === IPrescriptionControlTemplateType.Dropdown) {
            return (
                <DropdownEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.DoctorInformation) {
            return (
                <DoctorInformationEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                    existingDoctorInformation={this.props.doctorUser}
                    hideSearch={true}
                    enableNonTouchFields={true}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.MultilineText) {
            return (
                <MultilineTextEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.SingleLineText) {
            return (
                <SingleLineTextEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.Checkbox) {
            return (
                <CheckboxEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                    makeBlackAndWhite={true}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.Number) {
            return (
                <NumberEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
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
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.CaseDeadline) {
            return (
                <CaseDeadlineEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        }

        return <div/>
    }
}