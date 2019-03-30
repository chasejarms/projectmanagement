import { Action } from "redux";
import { UPDATE_CONTROL_VALUE_CASE_CREATION } from "../Actions/caseCreationActions";

export interface IUpdateControlValueCaseCreationAction extends Action<typeof UPDATE_CONTROL_VALUE_CASE_CREATION> {
    controlId: string;
    value: any;
}

export type ICaseCreationActions = IUpdateControlValueCaseCreationAction;

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