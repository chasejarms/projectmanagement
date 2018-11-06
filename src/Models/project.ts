import { ICheckpoint } from './checkpoint';

export interface IProject {
    id: string;
    name: string;
    deadline: Date;
    checkpoints: ICheckpoint[];
    complete: boolean;
    doctor: any;
    notes: string;
    attachments: any[];
}