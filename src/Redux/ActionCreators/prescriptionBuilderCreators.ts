import { Action } from "redux";
import { SET_EDIT_MODE, SET_VIEW_MODE } from "../Actions/prescriptionBuilderActions";

export interface ISetEditModeAction extends Action<typeof SET_EDIT_MODE> {
    companyId: string;
}

export interface ISetViewModeAction extends Action<typeof SET_VIEW_MODE> {
    companyId: string;
}

export type IPrescriptionBuilderActions = ISetEditModeAction;

export const setEditMode = (companyId: string): ISetEditModeAction => {
    return {
        type: SET_EDIT_MODE,
        companyId,
    }
}

export const setViewMode = (companyId: string): ISetViewModeAction => {
    return {
        type: SET_VIEW_MODE,
        companyId,
    }
}