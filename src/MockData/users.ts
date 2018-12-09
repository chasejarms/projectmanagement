import { IUser } from '../Models/user';

export const users: IUser[] = [
    {
        id: '1',
        fullName: 'Chase Armstrong',
        email: 'chasejarms@gmail.com',
        type: 'Admin',
        added: Date.now().toString(),
    },
    {
        id: '2',
        fullName: 'Christian Eaton',
        email: 'christian12@yahoo.com',
        type: 'Admin',
        added: Date.now().toString(),
    },
    {
        id: '3',
        fullName: 'Jane Doe',
        email: 'jane_doe@hotmail.com',
        type: 'Customer',
        added: Date.now().toString(),
    },
    {
        id: '4',
        fullName: 'Jim Gaffigan',
        email: 'jgaff@gmail.com',
        type: 'Customer',
        added: Date.now().toString(),
    }
]