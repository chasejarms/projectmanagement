import { ICheckpoint } from './../../Models/checkpoint';
import { IProject } from './../../Models/project';
import { ISlimProjects } from './../../Models/slimProject';
import { IProjectsApi } from './projectsInterface';

export class ProjectsApi implements IProjectsApi {
    public getSlimProjects(companyName: string): ISlimProjects[] {
        throw Error('method not implemented');
    }

    public createProject(companyName: string, project: IProject): IProject {
        throw new Error("Method not implemented.");
    }

    public getProjectCheckpoints(companyName: string, projectId: string): ICheckpoint[] {
        throw new Error("Method not implemented.");
    }

    public getProjectName(companyName: string, projectId: string): string {
        throw new Error("Method not implemented.");
    }
}