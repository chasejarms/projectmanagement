export interface IUser {
    id: string;
    uid: string;
    email: string;
    fullName: string;
    type: 'Admin' | 'Staff' | 'Customer';
    mustResetPassword: boolean;
    scanCheckpoints?: string[];
}