import * as firebase from 'firebase';
import { ICase } from './../../Models/case';
import { ICheckpoint } from './../../Models/checkpoint';
import { ISlimCase } from './../../Models/slimCase';
import { ICaseApi, ICaseCreateRequest, ISlimCasesSearchRequest } from './projectsInterface';

export class ProjectsApi implements ICaseApi {
    public async getSlimCases(slimCasesSearchRequest: ISlimCasesSearchRequest): Promise<ISlimCase[]> {
        const slimProjectsCloudFunction = firebase.functions().httpsCallable('getCases');
        let slimProjectsResult: firebase.functions.HttpsCallableResult;
        try {
            slimProjectsResult = await slimProjectsCloudFunction(slimCasesSearchRequest);
        } catch (error) {
            return Promise.reject(error.message);
        }

        return slimProjectsResult.data;
    }

    public async createProject(companyId: string, projectCreateRequest: ICaseCreateRequest): Promise<ICase> {
        const createCaseCloudFunction = firebase.functions().httpsCallable('createCase');
        let createCaseResponse: firebase.functions.HttpsCallableResult;
        try {
            createCaseResponse = await createCaseCloudFunction(projectCreateRequest);
        } catch (error) {
            return Promise.reject(error.message);
        }
        // tslint:disable-next-line:no-console
        console.log('createCaseResponse: ', createCaseResponse);
        return {
            id: createCaseResponse.data,
        } as any;
    }

    public async getProject(caseId: string): Promise<ICase> {
        const documentReference = await firebase.firestore()
            .collection('cases')
            .doc(caseId)
            .get();

        return documentReference.data()! as ICase;
    }

    public async uploadFile(companyId: string, projectId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot> {
        const storageRef = firebase.storage().ref();
        const updatedStorageRef = storageRef.child(`${companyId}/${projectId}/${file.name}`);
        const uploadTaskSnapshot: firebase.storage.UploadTaskSnapshot = await updatedStorageRef.put(file);

        return uploadTaskSnapshot;
    }

    public async getProjectCheckpoints(caseCheckpoints: string[]): Promise<ICheckpoint[]> {
        const caseCheckpointPromises = caseCheckpoints.map((caseCheckpointId) => {
            return firebase.firestore().collection('caseCheckpoints')
                .doc(caseCheckpointId)
                .get();
        });

        const caseDocumentReferences = await Promise.all(caseCheckpointPromises);

        return caseDocumentReferences.map((caseDocumentReference) => {
            return caseDocumentReference.data() as ICheckpoint;
        });
    }

    public updateProject(companyId: string, project: ICase): ICase {
        throw new Error("Method not implemented");
    }

}