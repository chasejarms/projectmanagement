import { IUnitedStatesAddress } from './unitedStatesAddress'
import { UserType } from './userTypes';
;

export interface ICloudFunctionUserCreateRequest {
    companyId: string;
    email: string;
    name: string;
    type: UserType;
    scanCheckpointIds?: string[];
    address?: IUnitedStatesAddress;
    telephone?: string;
}