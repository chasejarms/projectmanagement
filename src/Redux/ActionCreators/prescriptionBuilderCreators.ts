import { Action } from 'redux';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import {
    ON_DROP_EXISTING_CONTROL_PRESCRIPTION_FORM_TEMPLATE,
    ON_DROP_EXISTING_SECTION_PRESCRIPTION_FORM_TEMPLATE,
    ON_DROP_NEW_CONTROL_PRESCRIPTION_FORM_TEMPLATE,
    ON_DROP_NEW_SECTION_PRESCRIPTION_FORM_TEMPLATE,
    REMOVE_CONTROL_PRESCRIPTION_FORM_TEMPLATE,
    REMOVE_SECTION_PRESCRIPTION_FORM_TEMPLATE,
    SET_EDIT_MODE,
    SET_PRESCRIPTION_FORM_TEMPLATE,
    SET_SELECTED_CONTROL_PRESCRIPTION_FORM_TEMPLATE,
    SET_SELECTED_SECTION_PRESCRIPTION_FORM_TEMPLATE,
    SET_VIEW_MODE,
    UPDATE_CONTROL_VALUE_PRESCRIPTION_FORM_TEMPLATE,
} from '../Actions/prescriptionBuilderActions';
import { SET_COMPANY_LOGO_URL } from './../Actions/prescriptionBuilderActions';

export interface ISetEditModeAction extends Action<typeof SET_EDIT_MODE> {}

export interface ISetViewModeAction extends Action<typeof SET_VIEW_MODE> {}

export interface ISetPrescriptionFormTemplateAction extends Action<typeof SET_PRESCRIPTION_FORM_TEMPLATE> {
    prescriptionFormTemplate: IPrescriptionFormTemplate;
}

export interface IAddNewSectionPrescriptionFormTemplateAction extends Action<typeof ON_DROP_NEW_SECTION_PRESCRIPTION_FORM_TEMPLATE> {
    item: any;
    insertPosition: number;
}

export interface IOnDropExistingSectionPrescriptionFormTemplateAction extends Action<typeof ON_DROP_EXISTING_SECTION_PRESCRIPTION_FORM_TEMPLATE> {
    item: any;
    insertPosition: number;
}

export interface IOnDropNewControlPrescriptionFormTemplateAction extends Action<typeof ON_DROP_NEW_CONTROL_PRESCRIPTION_FORM_TEMPLATE> {
    sectionId: string;
    insertPosition: number;
    item: any;
}

export interface IOnDropExistingControlPrescriptionFormTemplateAction extends Action<typeof ON_DROP_EXISTING_CONTROL_PRESCRIPTION_FORM_TEMPLATE> {
    targetSectionId: string;
    insertPosition: number;
    item: any;
}

export interface IRemoveControlPrescriptionFormTemplateAction extends Action<typeof REMOVE_CONTROL_PRESCRIPTION_FORM_TEMPLATE> {}

export interface IRemoveSectionPrescriptionFormTemplateAction extends Action<typeof REMOVE_SECTION_PRESCRIPTION_FORM_TEMPLATE> {}

export interface ISetSelectedControlPrescriptionFormTemplateAction extends Action<typeof SET_SELECTED_CONTROL_PRESCRIPTION_FORM_TEMPLATE> {
    controlId: string | null;
}

export interface ISetSelectedSectionPrescriptionFormTemplateAction extends Action<typeof SET_SELECTED_SECTION_PRESCRIPTION_FORM_TEMPLATE> {
    sectionId: string | null;
}

export interface IUpdateControlValuePrescriptionFormTemplateAction extends Action<typeof UPDATE_CONTROL_VALUE_PRESCRIPTION_FORM_TEMPLATE> {
    controlId: string;
    value: any;
}

export interface ISetCompanyLogoUrlPrescriptionFormTemplateAction extends Action<typeof SET_COMPANY_LOGO_URL> {
    companyLogoURL: string | null;
}

export type IPrescriptionBuilderActions = ISetEditModeAction |
    ISetViewModeAction |
    ISetPrescriptionFormTemplateAction |
    IAddNewSectionPrescriptionFormTemplateAction |
    IOnDropExistingSectionPrescriptionFormTemplateAction |
    IOnDropNewControlPrescriptionFormTemplateAction |
    IOnDropExistingControlPrescriptionFormTemplateAction |
    IRemoveControlPrescriptionFormTemplateAction |
    IRemoveSectionPrescriptionFormTemplateAction |
    ISetSelectedControlPrescriptionFormTemplateAction |
    ISetSelectedSectionPrescriptionFormTemplateAction |
    IUpdateControlValuePrescriptionFormTemplateAction |
    ISetCompanyLogoUrlPrescriptionFormTemplateAction;

export const setEditMode = (): ISetEditModeAction => {
    return {
        type: SET_EDIT_MODE,
    }
}

export const setViewMode = (): ISetViewModeAction => {
    return {
        type: SET_VIEW_MODE,
    }
}

export const setPrescriptionFormTemplate = (prescriptionFormTemplate: IPrescriptionFormTemplate): ISetPrescriptionFormTemplateAction => {
    return {
        type: SET_PRESCRIPTION_FORM_TEMPLATE,
        prescriptionFormTemplate,
    }
}

export const addNewSectionToPrescriptionFormTemplate = (
    item: any,
    insertPosition: number,
): IAddNewSectionPrescriptionFormTemplateAction => {
    return {
        type: ON_DROP_NEW_SECTION_PRESCRIPTION_FORM_TEMPLATE,
        insertPosition,
        item,
    }
}

export const onDropExistingSectionPrescriptionFormTemplate = (
    item: any,
    insertPosition: number,
): IOnDropExistingSectionPrescriptionFormTemplateAction => {
    return {
        type: ON_DROP_EXISTING_SECTION_PRESCRIPTION_FORM_TEMPLATE,
        insertPosition,
        item,
    }
}

export const onDropNewControlPrescriptionFormTemplate = (
    sectionId: string,
    insertPosition: number,
    item: any,
): IOnDropNewControlPrescriptionFormTemplateAction => {
    return {
        type: ON_DROP_NEW_CONTROL_PRESCRIPTION_FORM_TEMPLATE,
        insertPosition,
        sectionId,
        item,
    }
}

export const onDropExistingControlPrescriptionFormTemplate = (
    targetSectionId: string,
    insertPosition: number,
    item: any,
): IOnDropExistingControlPrescriptionFormTemplateAction => {
    return {
        type: ON_DROP_EXISTING_CONTROL_PRESCRIPTION_FORM_TEMPLATE,
        targetSectionId,
        insertPosition,
        item,
    }
}

export const removeControlPrescriptionFormTemplate = (): IRemoveControlPrescriptionFormTemplateAction => {
    return {
        type: REMOVE_CONTROL_PRESCRIPTION_FORM_TEMPLATE,
    }
}

export const removeSectionPrescriptionFormTemplate = (): IRemoveSectionPrescriptionFormTemplateAction => {
    return {
        type: REMOVE_SECTION_PRESCRIPTION_FORM_TEMPLATE,
    }
}

export const setSelectedControl = (
    controlId: null | string,
): ISetSelectedControlPrescriptionFormTemplateAction => {
    return {
        type: SET_SELECTED_CONTROL_PRESCRIPTION_FORM_TEMPLATE,
        controlId,
    }
}

export const setSelectedSection = (
    sectionId: null | string,
): ISetSelectedSectionPrescriptionFormTemplateAction => {
    return {
        type: SET_SELECTED_SECTION_PRESCRIPTION_FORM_TEMPLATE,
        sectionId,
    }
}

export const updateControlValue = (
    controlId: string,
    value: any,
): IUpdateControlValuePrescriptionFormTemplateAction => {
    return {
        type: UPDATE_CONTROL_VALUE_PRESCRIPTION_FORM_TEMPLATE,
        controlId,
        value,
    }
}

export const setCompanyLogoUrl = (
    companyLogoURL: string | null,
): ISetCompanyLogoUrlPrescriptionFormTemplateAction => {
    return {
        type: SET_COMPANY_LOGO_URL,
        companyLogoURL,
    }
}