import { User } from 'firebase';
import { Action } from 'redux';

export const SET_ADMIN = 'SET_ADMIN';
export const CLEAR_ADMIN_STATE = 'CLEAR_ADMIN_STATE';

type UserActionType = typeof SET_ADMIN | typeof CLEAR_ADMIN_STATE;

interface IUserAction extends Action<UserActionType> {
  isAdmin: boolean;
}

export const adminUserReducer = (state: User | null = null, action: IUserAction) => {
  switch (action.type) {
    case SET_ADMIN:
      return action.isAdmin;
    case CLEAR_ADMIN_STATE:
      return null;
    default:
      return state;
  }
};
