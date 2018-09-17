import { ISlimProjects } from './../../Models/slimProject';

export interface IProjectsApi {
    getSlimProjects(companyName: string): ISlimProjects[];
}