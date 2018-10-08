export interface IProjectCreationProjectUser {
    userId: string;
    email: string;
    name: string;
    type: 'Admin' | 'Staff' | 'Customer';
    checkpoints: Set<string>;
}