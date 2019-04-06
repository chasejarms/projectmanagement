import { combineReducers } from 'redux';
import { authenticatedUIReducer, IAuthenticatedUISliceOfState } from './authenticatedUIReducer';
import { caseCreationReducer, ICaseCreationSliceOfState } from './caseCreationReducer';
import { IPrescriptionBuilderSliceOfState, prescriptionBuilderReducer } from './prescriptionBuilderReducer';
import { IUserSliceOfState, userReducer } from './userReducer';

export interface IAppState {
    userState: IUserSliceOfState;
    prescriptionBuilderState: IPrescriptionBuilderSliceOfState;
    caseCreationState: ICaseCreationSliceOfState;
    authenticatedUIState: IAuthenticatedUISliceOfState;
}

export const rootReducer = combineReducers({
    userState: userReducer,
    prescriptionBuilderState: prescriptionBuilderReducer,
    caseCreationState: caseCreationReducer,
    authenticatedUIState: authenticatedUIReducer,
});