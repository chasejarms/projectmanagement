import { combineReducers } from 'redux';
import { IPrescriptionBuilderSliceOfState, prescriptionBuilderReducer } from './prescriptionBuilderReducer';
import { IUserSliceOfState, userReducer } from './userReducer';

export interface IAppState {
    userState: IUserSliceOfState;
    prescriptionBuilderState: IPrescriptionBuilderSliceOfState;
}

export const rootReducer = combineReducers({
    userState: userReducer,
    prescriptionBuilderState: prescriptionBuilderReducer,
});