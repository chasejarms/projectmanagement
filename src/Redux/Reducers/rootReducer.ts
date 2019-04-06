import { combineReducers } from 'redux';
import { caseCreationReducer, ICaseCreationSliceOfState } from './caseCreationReducer';
import { IMainUISliceOfState, mainUIReducer } from './mainUIReducer';
import { IPrescriptionBuilderSliceOfState, prescriptionBuilderReducer } from './prescriptionBuilderReducer';
import { IUserSliceOfState, userReducer } from './userReducer';

export interface IAppState {
    userState: IUserSliceOfState;
    prescriptionBuilderState: IPrescriptionBuilderSliceOfState;
    caseCreationState: ICaseCreationSliceOfState;
    mainUIState: IMainUISliceOfState;
}

export const rootReducer = combineReducers({
    userState: userReducer,
    prescriptionBuilderState: prescriptionBuilderReducer,
    caseCreationState: caseCreationReducer,
    mainUIState: mainUIReducer,
});