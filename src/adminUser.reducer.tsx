import { User } from 'firebase';
import { Action } from 'redux';

export const SET_ADMIN = 'SET_ADMIN';
export const CLEAR_ADMIN_STATE = 'CLEAR_ADMIN_STATE';

type UserActionType = typeof SET_ADMIN | typeof CLEAR_ADMIN_STATE;

interface UserAction extends Action<UserActionType> {
  isAdmin: boolean;
}

export const adminUserReducer = (state: User | null = null, action: UserAction) => {
  switch (action.type) {
    case SET_ADMIN:
      return action.isAdmin;
    case CLEAR_ADMIN_STATE:
      return null;
    default:
      return state;
  }
};
