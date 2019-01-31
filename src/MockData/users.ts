import { UserType } from 'src/Models/userTypes';
import { IUser } from '../Models/user';

export const users: IUser[] = [
    {
        id: '1',
        fullName: 'Chase Armstrong',
        email: 'chasejarms@gmail.com',
        type: UserType.Admin,
        uid: '234',
        mustResetPassword: false,
    },
    {
        id: '2',
        fullName: 'Christian Eaton',
        email: 'christian12@yahoo.com',
        type: UserType.Admin,
        uid: '345',
        mustResetPassword: false,
    },
    {
        id: '3',
        fullName: 'Jane Doe',
        email: 'jane_doe@hotmail.com',
        type: UserType.Doctor,
        uid: '456',
        mustResetPassword: false,
    },
    {
        id: '4',
        fullName: 'Jim Gaffigan',
        email: 'jgaff@gmail.com',
        type: UserType.Doctor,
        uid: '678',
        mustResetPassword: false,
    }
] as any;