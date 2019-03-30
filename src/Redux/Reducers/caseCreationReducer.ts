import { cloneDeep } from "lodash";
import { ICaseCreationActions } from "../ActionCreators/caseCreationCreator";
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
            return caseCreationTemplateAfterControlUpdate(
                state,
                action,
            );
        default:
            return state;
    }
}

const caseCreationTemplateAfterControlUpdate = (
    state: ICaseCreationSliceOfState,
    action: ICaseCreationActions,
) => {
    const value = action.value;
    const controlValuesCopy = cloneDeep(state.controlValues);

    controlValuesCopy[action.controlId] = value;

    return {
        ...state,
        controlValues: controlValuesCopy,
    }
}