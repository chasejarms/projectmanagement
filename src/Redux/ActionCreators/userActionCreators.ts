import { Action } from 'redux';
import { IUser } from '../../Models/user';
import { REMOVE_CURRENT_USER_FOR_COMPANY, SET_CURRENT_USER_FOR_COMPANY } from '../Actions/userActions';

export interface ISetCurrentUserAction extends Action<typeof SET_CURRENT_USER_FOR_COMPANY> {
    companyId: string;
    user: IUser;
}

export interface IRemoveCurrentUserAction extends Action<typeof REMOVE_CURRENT_USER_FOR_COMPANY> {
    companyId: string;
}

export type IUserActions = ISetCurrentUserAction |
    IRemoveCurrentUserAction;

export const setUserForCompany = (companyId: string, user: IUser): ISetCurrentUserAction => {
    return {
        type: SET_CURRENT_USER_FOR_COMPANY,
        companyId,
        user,
    }
}

export const removeUserForCompany = (companyId: string): IRemoveCurrentUserAction => {
    return {
        type: REMOVE_CURRENT_USER_FOR_COMPANY,
        companyId,
    }
}