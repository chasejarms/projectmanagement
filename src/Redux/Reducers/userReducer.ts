import { cloneDeep } from "lodash";
import { IUser } from "src/Models/user";
import { ISetCurrentUserAction, IUserActions } from "../ActionCreators/userActionCreators";
import { REMOVE_CURRENT_USER_FOR_COMPANY, SET_CURRENT_USER_FOR_COMPANY } from "../Actions/userActions";

export interface IUserSliceOfState {
    [companyId: string]: IUser;
}

const initialState = {}

export const userReducer = (state: IUserSliceOfState = initialState, action: IUserActions) => {
    switch (action.type) {
        case SET_CURRENT_USER_FOR_COMPANY:
            const setUserAction = action as ISetCurrentUserAction;
            return {
                ...state,
                [setUserAction.companyId]: setUserAction.user,
            };
        case REMOVE_CURRENT_USER_FOR_COMPANY:
            const clonedState = cloneDeep(state);
            delete clonedState[action.companyId];
            return clonedState;
        default:
            return state;
    }
}