import { ICheckpoint } from './../../Models/checkpoint';
import { IProject } from './../../Models/project';
import { ISlimProject } from './../../Models/slimProject';

export interface IProjectCreateRequest {
    name: string;
    deadline: Date;
    notes: string;
    companyName: string;
}

export interface IProjectsApi {
    getSlimProjects(companyName: string): Promise<ISlimProject[]>;
    createProject(companyName: string, projectCreateRequest: IProjectCreateRequest): Promise<IProject>;
    getProject(projectId: string): IProject;
    getProjectCheckpoints(companyName: string, projectId: string): ICheckpoint[];
    updateProject(companyName: string, project: IProject): IProject;
}