import { ICheckpoint } from './../../Models/checkpoint';
import { IProject } from './../../Models/project';
import { ISlimProjects } from './../../Models/slimProject';

export interface IProjectsApi {
    getSlimProjects(companyName: string): ISlimProjects[];
    createProject(companyName: string, project: IProject): IProject;
    getProject(projectId: string): IProject;
    getProjectCheckpoints(companyName: string, projectId: string): ICheckpoint[];
    updateProject(companyName: string, project: IProject): IProject;
}