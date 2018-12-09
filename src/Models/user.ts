export interface IUser {
    id: string;
    email: string;
    fullName: string;
    type: 'Admin' | 'Staff' | 'Customer';
    added: string;
    scanCheckpoints?: string[];
}