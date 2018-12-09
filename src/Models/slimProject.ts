export interface ISlimProject {
    id: string;
    projectId: string;
    projectName: string;
    currentCheckpoint: string;
    deadline: string;
    showNewInfoFrom: 'doctor' | 'lab' | null;
}