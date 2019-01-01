export interface IUser extends IUserCreateRequest {
    id: string;
    uid: string;
}

export interface IUserCreateRequest {
    companyId: string;
    email: string;
    fullName: string;
    type: 'Admin' | 'Staff' | 'Customer';
    mustResetPassword: boolean;
    scanCheckpoints?: string[];
}