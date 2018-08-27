export interface ICheckpoint {
    name: string;
    description?: string;
    deadline?: Date;
    complete: boolean;
    public: boolean;
    projectId: string;
    id: string;
}