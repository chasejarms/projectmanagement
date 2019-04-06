import { IMainUIActions, ISetHasMultipleCompaniesAction } from "../ActionCreators/mainUIActionCreators";
import { SET_HAS_MULTIPLE_COMPANIES } from "../Actions/mainUIActions";

export interface IMainUISliceOfState {
    hasMultipleCompanies: boolean;
}

const initialState: IMainUISliceOfState = {
    hasMultipleCompanies: false,
}

export const mainUIReducer = (
    state: IMainUISliceOfState = initialState,
    action: IMainUIActions,
) => {
    switch (action.type) {
        case SET_HAS_MULTIPLE_COMPANIES:
            const setHasMultipleCompaniesAction = action as ISetHasMultipleCompaniesAction;
            return {
                hasMultipleCompanies: setHasMultipleCompaniesAction.hasMultipleCompanies,
            }
        default:
            return initialState;
    }
}