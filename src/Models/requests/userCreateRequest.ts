import { IUnitedStatesAddress } from "../unitedStatesAddress";
import { UserType } from "../userTypes";

export interface IUserCreateRequest {
    companyId: string;
    email: string;
    fullName: string;
    type: UserType;
    scanCheckpoints?: string[];
    address?: IUnitedStatesAddress;
    telephone?: string;
}