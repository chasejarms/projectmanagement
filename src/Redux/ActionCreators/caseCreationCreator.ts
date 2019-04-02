import { Action } from "redux";
import { CLEAR_CASE_CREATION_STATE, UPDATE_CONTROL_VALUE_CASE_CREATION } from "../Actions/caseCreationActions";

export interface IUpdateControlValueCaseCreationAction extends Action<typeof UPDATE_CONTROL_VALUE_CASE_CREATION> {
    controlId: string;
    value: any;
}

export interface IClearCaseCreationStateAction extends Action<typeof CLEAR_CASE_CREATION_STATE> {}

export type ICaseCreationActions = IUpdateControlValueCaseCreationAction |
    IClearCaseCreationStateAction;

export const updateCaseCreationControlValue = (
    controlId: string,
    value: any,
): IUpdateControlValueCaseCreationAction => {
    return {
        type: UPDATE_CONTROL_VALUE_CASE_CREATION,
        controlId,
        value,
    }
}

export const clearCaseCreationState = (): IClearCaseCreationStateAction => ({
    type: CLEAR_CASE_CREATION_STATE,
})