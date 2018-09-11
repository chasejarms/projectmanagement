import { IUser } from '../Models/user';

export const users: IUser[] = [
    {
        id: '1',
        name: 'Chase Armstrong',
        email: 'chasejarms@gmail.com',
        type: 'Admin',
        added: new Date(),
    },
    {
        id: '2',
        name: 'Christian Eaton',
        email: 'christian12@yahoo.com',
        type: 'Admin',
        added: new Date(),
    },
    {
        id: '3',
        name: 'Jane Doe',
        email: 'jane_doe@hotmail.com',
        type: 'Customer',
        added: new Date(),
    },
    {
        id: '4',
        name: 'Jim Gaffigan',
        email: 'jgaff@gmail.com',
        type: 'Customer',
        added: new Date(),
    }
]