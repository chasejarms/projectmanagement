import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { IPrescriptionBuilderActions } from "../ActionCreators/prescriptionBuilderCreators";
import { SET_EDIT_MODE, SET_VIEW_MODE } from "../Actions/prescriptionBuilderActions";

export interface IPrescriptionBuilderSliceOfState {
    editMode: boolean;
    prescriptionFormTemplate?: IPrescriptionFormTemplate;
}

const initialState = {
    editMode: true,
}

export const prescriptionBuilderReducer = (state: IPrescriptionBuilderSliceOfState = initialState, action: IPrescriptionBuilderActions) => {
    switch (action.type) {
        case SET_VIEW_MODE:
            return {
                ...state,
                editMode: false,
            }
        case SET_EDIT_MODE:
            return {
                ...state,
                editMode: true,
            }
        default:
            return state;
    }
}