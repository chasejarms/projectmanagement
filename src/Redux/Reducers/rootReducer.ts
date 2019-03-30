import { combineReducers } from 'redux';
import { caseCreationReducer, ICaseCreationSliceOfState } from './caseCreationReducer';
import { IPrescriptionBuilderSliceOfState, prescriptionBuilderReducer } from './prescriptionBuilderReducer';
import { IUserSliceOfState, userReducer } from './userReducer';

export interface IAppState {
    userState: IUserSliceOfState;
    prescriptionBuilderState: IPrescriptionBuilderSliceOfState;
    caseCreationState: ICaseCreationSliceOfState;
}

export const rootReducer = combineReducers({
    userState: userReducer,
    prescriptionBuilderState: prescriptionBuilderReducer,
    caseCreationState: caseCreationReducer,
});