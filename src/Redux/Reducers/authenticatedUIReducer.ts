import { IAuthenticatedUIActions, ISetHasMultipleCompaniesAction } from "../ActionCreators/authenticatedUIActionCreators";
import { SET_HAS_MULTIPLE_COMPANIES } from "../Actions/authenticatedUIActions";

export interface IAuthenticatedUISliceOfState {
    hasMultipleCompanies: boolean;
}

const initialState: IAuthenticatedUISliceOfState = {
    hasMultipleCompanies: false,
}

export const authenticatedUIReducer = (
    state: IAuthenticatedUISliceOfState = initialState,
    action: IAuthenticatedUIActions,
) => {
    switch (action.type) {
        case SET_HAS_MULTIPLE_COMPANIES:
            const setHasMultipleCompaniesAction = action as ISetHasMultipleCompaniesAction;
            return {
                hasMultipleCompanies: setHasMultipleCompaniesAction.hasMultipleCompanies,
            }
        default:
            return state;
    }
}