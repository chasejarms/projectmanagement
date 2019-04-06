import { Action } from "redux";
import { SET_HAS_MULTIPLE_COMPANIES } from "../Actions/mainUIActions";

export interface ISetHasMultipleCompaniesAction extends Action<typeof SET_HAS_MULTIPLE_COMPANIES> {
    hasMultipleCompanies: boolean;
}

export type IMainUIActions = ISetHasMultipleCompaniesAction;

export const setHasMultipleCompanies = (
    hasMultipleCompanies: boolean,
): ISetHasMultipleCompaniesAction => {
    return {
        type: SET_HAS_MULTIPLE_COMPANIES,
        hasMultipleCompanies,
    }
}