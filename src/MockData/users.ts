import { IUser } from '../Models/user';

export const users: IUser[] = [
    {
        id: '1',
        fullName: 'Chase Armstrong',
        email: 'chasejarms@gmail.com',
        type: 'Admin',
        uid: '234',
        mustResetPassword: false,
    },
    {
        id: '2',
        fullName: 'Christian Eaton',
        email: 'christian12@yahoo.com',
        type: 'Admin',
        uid: '345',
        mustResetPassword: false,
    },
    {
        id: '3',
        fullName: 'Jane Doe',
        email: 'jane_doe@hotmail.com',
        type: 'Customer',
        uid: '456',
        mustResetPassword: false,
    },
    {
        id: '4',
        fullName: 'Jim Gaffigan',
        email: 'jgaff@gmail.com',
        type: 'Customer',
        uid: '678',
        mustResetPassword: false,
    }
] as any;