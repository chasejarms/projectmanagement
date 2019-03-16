import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { IPrescriptionBuilderActions, ISetPrescriptionFormTemplateAction } from "../ActionCreators/prescriptionBuilderCreators";
import { SET_EDIT_MODE, SET_PRESCRIPTION_FORM_TEMPLATE, SET_VIEW_MODE } from "../Actions/prescriptionBuilderActions";

export interface IPrescriptionBuilderSliceOfState {
    editMode: boolean;
    prescriptionFormTemplate?: IPrescriptionFormTemplate;
}

const initialState = {
    editMode: true,
    prescriptionFormTemplate: {
        sectionOrder: [],
        sections: {},
        controls: {},
    },
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
        case SET_PRESCRIPTION_FORM_TEMPLATE:
            const {
                prescriptionFormTemplate,
            } = action as ISetPrescriptionFormTemplateAction;
            return {
                ...state,
                prescriptionFormTemplate,
            }
        default:
            return state;
    }
}