import { combineReducers } from 'redux';
import { authenticatedUIReducer, IAuthenticatedUISliceOfState } from './authenticatedUIReducer';
import { caseCreationReducer, IProjectCreationSliceOfState } from './caseCreationReducer';
import { existingCaseReducer, IExistingCaseSliceOfState } from './existingCaseReducer';
import { IPrescriptionBuilderSliceOfState, prescriptionBuilderReducer } from './prescriptionBuilderReducer';
import { IUserSliceOfState, userReducer } from './userReducer';

export interface IAppState {
    userState: IUserSliceOfState;
    prescriptionBuilderState: IPrescriptionBuilderSliceOfState;
    caseCreationState: IProjectCreationSliceOfState;
    authenticatedUIState: IAuthenticatedUISliceOfState;
    existingCaseState: IExistingCaseSliceOfState;
}

export const rootReducer = combineReducers({
    userState: userReducer,
    prescriptionBuilderState: prescriptionBuilderReducer,
    caseCreationState: caseCreationReducer,
    authenticatedUIState: authenticatedUIReducer,
    existingCaseState: existingCaseReducer,
});