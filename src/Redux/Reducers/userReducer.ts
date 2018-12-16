import { IUser } from "src/Models/user";
import { ISetCurrentUserAction, IUserActions } from "../ActionCreators/userActionCreators";
import { REMOVE_CURRENT_USER, SET_CURRENT_USER } from "../Actions/userActions";

export interface IUserSliceOfState {
    user: IUser | undefined;
}

const initialState = {
    user: undefined,
}

export const userReducer = (state: IUserSliceOfState = initialState, action: IUserActions) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            const setUserAction = action as ISetCurrentUserAction;
            return {
                user: setUserAction.user,
            };
        case REMOVE_CURRENT_USER:
            return {
                user: undefined,
            }
        default:
            return state;
    }
}