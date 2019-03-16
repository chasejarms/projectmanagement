import { Action } from 'redux';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { SET_EDIT_MODE, SET_PRESCRIPTION_FORM_TEMPLATE, SET_VIEW_MODE } from '../Actions/prescriptionBuilderActions';

export interface ISetEditModeAction extends Action<typeof SET_EDIT_MODE> {}

export interface ISetViewModeAction extends Action<typeof SET_VIEW_MODE> {}

export interface ISetPrescriptionFormTemplateAction extends Action<typeof SET_PRESCRIPTION_FORM_TEMPLATE> {
    prescriptionFormTemplate: IPrescriptionFormTemplate;
}

export type IPrescriptionBuilderActions = ISetEditModeAction | ISetViewModeAction | ISetPrescriptionFormTemplateAction;

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