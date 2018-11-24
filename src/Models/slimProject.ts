export interface ISlimProject {
    id: string;
    projectId: string;
    projectName: string;
    currentCheckpoint: string;
    deadline: Date;
    showNewInfoFrom: 'doctor' | 'lab' | null;
}