import { ISlimProjects } from './../../Models/slimProject';
import { IProjectsApi } from './projectsInterface';

export class ProjectsApi implements IProjectsApi {
    public getSlimProjects(companyName: string): ISlimProjects[] {
        throw Error('method not implemented');
    }
}