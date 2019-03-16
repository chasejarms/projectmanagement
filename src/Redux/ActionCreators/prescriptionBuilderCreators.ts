import { Action } from "redux";
import { SET_EDIT_MODE, SET_VIEW_MODE } from "../Actions/prescriptionBuilderActions";

export interface ISetEditModeAction extends Action<typeof SET_EDIT_MODE> {}

export interface ISetViewModeAction extends Action<typeof SET_VIEW_MODE> {}

export type IPrescriptionBuilderActions = ISetEditModeAction;

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