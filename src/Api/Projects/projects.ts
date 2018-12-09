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

    public async getProject(companyName: string, projectId: string): Promise<IProject> {
        const documentReference = await firebase.firestore()
            .collection('companies')
            .doc(companyName)
            .collection('cases')
            .doc(projectId)
            .get();

        return documentReference.data()! as IProject;
    }

    public async uploadFile(companyName: string, projectId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot> {
        const storageRef = firebase.storage().ref();
        const updatedStorageRef = storageRef.child(`${companyName}/${projectId}/${file.name}`);
        const uploadTaskSnapshot: firebase.storage.UploadTaskSnapshot = await updatedStorageRef.put(file);

        return uploadTaskSnapshot;
    }

    public async getProjectCheckpoints(companyName: string, projectId: string): Promise<ICheckpoint[]> {
        throw new Error("Method not implemented.");
    }

    public updateProject(companyName: string, project: IProject): IProject {
        throw new Error("Method not implemented");
    }

}