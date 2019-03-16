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
    SET_VIEW_MODE,
} from '../Actions/prescriptionBuilderActions';

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

export interface IRemoveControlPrescriptionFormTemplateAction extends Action<typeof REMOVE_CONTROL_PRESCRIPTION_FORM_TEMPLATE> {
    controlId: string;
}

export interface IRemoveSectionPrescriptionFormTemplateAction extends Action<typeof REMOVE_SECTION_PRESCRIPTION_FORM_TEMPLATE> {
    sectionId: string;
}

export type IPrescriptionBuilderActions = ISetEditModeAction |
    ISetViewModeAction |
    ISetPrescriptionFormTemplateAction |
    IAddNewSectionPrescriptionFormTemplateAction |
    IOnDropExistingSectionPrescriptionFormTemplateAction |
    IOnDropNewControlPrescriptionFormTemplateAction |
    IOnDropExistingControlPrescriptionFormTemplateAction |
    IRemoveControlPrescriptionFormTemplateAction |
    IRemoveSectionPrescriptionFormTemplateAction;

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

export const removeControlPrescriptionFormTemplate = (
    controlId: string,
): IRemoveControlPrescriptionFormTemplateAction => {
    return {
        type: REMOVE_CONTROL_PRESCRIPTION_FORM_TEMPLATE,
        controlId,
    }
}

export const removeSectionPrescriptionFormTemplate = (
    sectionId: string,
): IRemoveSectionPrescriptionFormTemplateAction => {
    return {
        type: REMOVE_SECTION_PRESCRIPTION_FORM_TEMPLATE,
        sectionId,
    }
}