export interface ISlimProjects {
    id: string;
    projectId: string;
    projectName: string;
    completionPercentage: number;
    currentCheckpoint: string;
    deadline: Date;
    deadlinePretty: string;
}