import { Action } from 'redux';
import { IUser } from '../../Models/user';
import { REMOVE_CURRENT_USER, SET_CURRENT_USER } from '../Actions/userActions';

export interface ISetCurrentUserAction extends Action<typeof SET_CURRENT_USER> {
    user: IUser,
}

export interface IRemoveCurrentUserAction extends Action<typeof REMOVE_CURRENT_USER> {}

export type IUserActions = ISetCurrentUserAction |
    IRemoveCurrentUserAction;

export const setCurrentUser = (user: IUser): ISetCurrentUserAction => {
    return {
        type: SET_CURRENT_USER,
        user,
    }
}

export const removeCurrentUser = () => {
    return {
        type: REMOVE_CURRENT_USER,
    }
}