import { firestore } from "firebase";
import { cloneDeep } from "lodash";
import { IExistingCaseActions, ISetControlValueStateExistingCaseAction, IUpdateControlValueExistingCaseAction } from "../ActionCreators/existingCaseActionCreators";
import { CLEAR_EXISTING_CASE_STATE, SET_CONTROL_VALUE_STATE_EXISTING_CASE, UPDATE_CONTROL_VALUE_EXISTING_CASE } from './../Actions/existingCaseActions';

export interface IExistingCaseSliceOfState {
    controlValues: {
        [controlId: string]: any;
    }
}

const initialState: IExistingCaseSliceOfState = {
    controlValues: {},
}

export const existingCaseReducer = (
    state: IExistingCaseSliceOfState = initialState,
    action: IExistingCaseActions,
) => {
    switch (action.type) {
        case UPDATE_CONTROL_VALUE_EXISTING_CASE:
            const updateAction = action as IUpdateControlValueExistingCaseAction;
            return existingCaseTemplateAfterControlUpdate(
                state,
                updateAction,
            );
        case SET_CONTROL_VALUE_STATE_EXISTING_CASE:
            const setControlStateAction = action as ISetControlValueStateExistingCaseAction;
            // tslint:disable-next-line:no-console
            console.log(setControlStateAction.controlValues);
            return {
                controlValues: setControlStateAction.controlValues,
            };
        case CLEAR_EXISTING_CASE_STATE:
        default:
            return state;
    }
}

const existingCaseTemplateAfterControlUpdate = (
    state: IExistingCaseSliceOfState,
    action: IUpdateControlValueExistingCaseAction,
) => {
    let value = action.value;
    const controlValuesCopy = cloneDeep(state.controlValues);

    if (value instanceof Date) {
        value = firestore.Timestamp.fromDate((value as Date));
    }

    controlValuesCopy[action.controlId] = value;

    return {
        controlValues: controlValuesCopy,
    }
}