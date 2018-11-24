import { ICheckpoint } from './../../Models/checkpoint';
import { IProject } from './../../Models/project';
import { ISlimProject } from './../../Models/slimProject';

export interface IProjectsApi {
    getSlimProjects(companyName: string): Promise<ISlimProject[]>;
    createProject(companyName: string, project: IProject): IProject;
    getProject(projectId: string): IProject;
    getProjectCheckpoints(companyName: string, projectId: string): ICheckpoint[];
    updateProject(companyName: string, project: IProject): IProject;
}