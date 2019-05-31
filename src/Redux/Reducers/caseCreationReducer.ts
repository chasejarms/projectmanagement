import { firestore } from 'firebase';
import { cloneDeep } from "lodash";
import { IProjectCreationActions, IUpdateControlValueCaseCreationAction } from "../ActionCreators/caseCreationCreator";
import { UPDATE_CONTROL_VALUE_CASE_CREATION } from "../Actions/caseCreationActions";

export interface IProjectCreationSliceOfState {
    controlValues: {
        [controlId: string]: any;
    }
}

const initialState: IProjectCreationSliceOfState = {
    controlValues: {},
}

export const caseCreationReducer = (
    state: IProjectCreationSliceOfState = initialState,
    action: IProjectCreationActions,
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
    state: IProjectCreationSliceOfState,
    action: IUpdateControlValueCaseCreationAction,
) => {
    let value = action.value;
    const controlValuesCopy = cloneDeep(state.controlValues);

    if (value instanceof Date) {
        value = firestore.Timestamp.fromDate((value as Date));
    }

    controlValuesCopy[action.controlId] = value;

    return {
        ...state,
        controlValues: controlValuesCopy,
    }
}