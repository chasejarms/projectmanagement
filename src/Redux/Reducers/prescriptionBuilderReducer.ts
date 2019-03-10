import { cloneDeep } from 'lodash';
import { IPrescriptionBuilderActions, ISetEditModeAction, ISetViewModeAction } from "../ActionCreators/prescriptionBuilderCreators";
import { SET_EDIT_MODE, SET_VIEW_MODE } from "../Actions/prescriptionBuilderActions";

export interface IPrescriptionBuilderSliceOfState {
    [companyId: string]: {
        editMode: boolean;
    }
}

const initialState = {}

export const prescriptionBuilderReducer = (state: IPrescriptionBuilderSliceOfState = initialState, action: IPrescriptionBuilderActions) => {
    const currentCompanyState = cloneDeep(state[action.companyId]);
    switch (action.type) {
        case SET_VIEW_MODE:
            const setViewModeAction = action as ISetViewModeAction;
            if (!currentCompanyState) {
                return {
                    ...state,
                    [setViewModeAction.companyId]: {
                        editMode: false,
                    }
                }
            } else {
                const updatedCompanyState = {
                    ...currentCompanyState,
                    editMode: false,
                }

                return {
                    ...state,
                    [setViewModeAction.companyId]: updatedCompanyState,
                }
            }
        case SET_EDIT_MODE:
            const setEditModeAction = action as ISetEditModeAction;
            if (!currentCompanyState) {
                return {
                    ...state,
                    [setEditModeAction.companyId]: {
                        editMode: true,
                    }
                }
            } else {
                const updatedCompanyState = {
                    ...currentCompanyState,
                    editMode: true,
                }

                return {
                    ...state,
                    [setEditModeAction.companyId]: updatedCompanyState,
                }
            }
        default:
            return state;
    }
}