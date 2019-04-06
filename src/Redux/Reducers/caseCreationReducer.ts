import { cloneDeep } from "lodash";
import { ICaseCreationActions, IUpdateControlValueCaseCreationAction } from "../ActionCreators/caseCreationCreator";
import { UPDATE_CONTROL_VALUE_CASE_CREATION } from "../Actions/caseCreationActions";

export interface ICaseCreationSliceOfState {
    controlValues: {
        [controlId: string]: any;
    }
}

const initialState: ICaseCreationSliceOfState = {
    controlValues: {},
}

export const caseCreationReducer = (
    state: ICaseCreationSliceOfState = initialState,
    action: ICaseCreationActions,
) => {
    switch (action.type) {
        case UPDATE_CONTROL_VALUE_CASE_CREATION:
            const updateAction = action as IUpdateControlValueCaseCreationAction;
            return caseCreationTemplateAfterControlUpdate(
                state,
                updateAction,
            );
        default:
            return initialState;
    }
}

const caseCreationTemplateAfterControlUpdate = (
    state: ICaseCreationSliceOfState,
    action: IUpdateControlValueCaseCreationAction,
) => {
    const value = action.value;
    const controlValuesCopy = cloneDeep(state.controlValues);

    controlValuesCopy[action.controlId] = value;

    return {
        ...state,
        controlValues: controlValuesCopy,
    }
}