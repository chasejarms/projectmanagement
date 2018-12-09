import * as firebase from 'firebase';
import { ICheckpoint } from './../../Models/checkpoint';
import { IProject } from './../../Models/project';
import { ISlimProject } from './../../Models/slimProject';
import { IProjectCreateRequest, IProjectsApi } from './projectsInterface';

export class ProjectsApi implements IProjectsApi {
    public async getSlimProjects(companyName: string): Promise<ISlimProject[]> {
        // tslint:disable-next-line:no-console
        console.log(companyName);
        const slimProjectsCloudFunction = firebase.functions().httpsCallable('getSlimProjects');
        let slimProjectsResult: firebase.functions.HttpsCallableResult;
        try {
            slimProjectsResult = await slimProjectsCloudFunction(companyName);
        } catch (error) {
            return Promise.reject(error.message);
        }

        return slimProjectsResult.data;
    }

    public async createProject(companyName: string, projectCreateRequest: IProjectCreateRequest): Promise<IProject> {
        const createProjectCloudFunction = firebase.functions().httpsCallable('createProject');
        let createProjectResult: firebase.functions.HttpsCallableResult;
        try {
            createProjectResult = await createProjectCloudFunction(projectCreateRequest);
        } catch (error) {
            return Promise.reject(error.message);
        }
        // tslint:disable-next-line:no-console
        console.log('createProjectResult: ', createProjectResult);
        return {
            id: createProjectResult.data,
        } as any;
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