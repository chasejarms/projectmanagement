import { Action } from "redux";
import { UPDATE_CONTROL_VALUE_EXISTING_CASE } from "../Actions/existingCaseActions";
import { CLEAR_EXISTING_CASE_STATE, SET_CONTROL_VALUE_STATE_EXISTING_CASE } from './../Actions/existingCaseActions';

export interface IUpdateControlValueExistingCaseAction extends Action<typeof UPDATE_CONTROL_VALUE_EXISTING_CASE> {
    controlId: string;
    value: any;
}

export interface IClearExistingCaseStateAction extends Action<typeof CLEAR_EXISTING_CASE_STATE> {}
export interface ISetControlValueStateExistingCaseAction extends Action<typeof SET_CONTROL_VALUE_STATE_EXISTING_CASE> {
    controlValues: {
        [controlId: string]: any,
    };
}

export type IExistingCaseActions = IUpdateControlValueExistingCaseAction |
    IClearExistingCaseStateAction |
    ISetControlValueStateExistingCaseAction;

export const updateExistingCaseControlValue = (
    controlId: string,
    value: any,
): IUpdateControlValueExistingCaseAction => {
    return {
        type: UPDATE_CONTROL_VALUE_EXISTING_CASE,
        controlId,
        value,
    }
};

export const clearExistingCaseState = (): IClearExistingCaseStateAction => {
    return {
        type: CLEAR_EXISTING_CASE_STATE,
    }
};

export const setCaseCreationControlValues = (
    controlValues: {
        [controlId: string]: any,
    },
): ISetControlValueStateExistingCaseAction => {
    return {
        type: SET_CONTROL_VALUE_STATE_EXISTING_CASE,
        controlValues,
    }
};