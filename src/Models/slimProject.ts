export interface ISlimProject {
    id: string;
    projectId: string;
    projectName: string;
    completionPercentage: number;
    currentCheckpoint: string;
    deadline: Date;
    nextCheckpointDeadlinePretty: string;
    showNewInfoFrom: 'doctor' | 'lab' | null;
}