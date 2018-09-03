export interface IUser {
    id: string;
    email: string;
    name: string;
    type: 'Admin' | 'Staff' | 'Customer';
    added: Date;
}