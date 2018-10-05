export interface ICheckpoint {
    name: string;
    description?: string;
    deadline?: Date;
    complete: boolean;
    projectId: string;
    id: string;
}