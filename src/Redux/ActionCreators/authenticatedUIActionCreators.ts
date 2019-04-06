import { Action } from "redux";
import { SET_HAS_MULTIPLE_COMPANIES } from "../Actions/authenticatedUIActions";

export interface ISetHasMultipleCompaniesAction extends Action<typeof SET_HAS_MULTIPLE_COMPANIES> {
    hasMultipleCompanies: boolean;
}

export type IAuthenticatedUIActions = ISetHasMultipleCompaniesAction;

export const setHasMultipleCompanies = (
    hasMultipleCompanies: boolean,
): ISetHasMultipleCompaniesAction => {
    return {
        type: SET_HAS_MULTIPLE_COMPANIES,
        hasMultipleCompanies,
    }
}