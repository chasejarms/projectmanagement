import { IUnitedStatesAddress } from "../unitedStatesAddress";
import { UserType } from "../userTypes";

export interface IUserCreateRequest {
    companyId: string;
    email: string;
    name: string;
    type: UserType;
    scanCheckpointIds?: string[];
    address?: IUnitedStatesAddress;
    telephone?: string;
}