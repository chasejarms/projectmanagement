import { ICheckpoint } from './../../Models/checkpoint';
import { IProject } from './../../Models/project';
import { ISlimProject } from './../../Models/slimProject';
import { IProjectsApi } from './projectsInterface';

export class ProjectsApi implements IProjectsApi {
    public getSlimProjects(companyName: string): ISlimProject[] {
        throw new Error("Method not implemented.");
    }

    public createProject(companyName: string, project: IProject): IProject {
        throw new Error("Method not implemented.");
    }

    public getProject(projectId: string): IProject {
        throw new Error("Method not implemented.");
    }

    public getProjectCheckpoints(companyName: string, projectId: string): ICheckpoint[] {
        throw new Error("Method not implemented.");
    }

    public updateProject(companyName: string, project: IProject): IProject {
        throw new Error("Method not implemented");
    }

}