import { ICase } from './../../Models/case';
import { ICheckpoint } from './../../Models/checkpoint';
import { ISlimCase } from './../../Models/slimCase';

export interface ICaseCreateRequest {
    name: string;
    deadline: string;
    notes: string;
    companyName: string;
}

export interface ISlimCasesSearchRequest {
    companyId: string;
    limit: number;
    startAfter?: FirebaseFirestore.DocumentSnapshot,
}

export interface ICaseApi {
    getSlimCases(slimCaseSearchRequest: ISlimCasesSearchRequest): Promise<ISlimCase[]>;
    createProject(companyName: string, projectCreateRequest: ICaseCreateRequest): Promise<ICase>;
    getProject(companyName: string, projectId: string): Promise<ICase>;
    getProjectCheckpoints(companyName: string, projectId: string): Promise<ICheckpoint[]>;
    uploadFile(companyName: string, projectId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot>;
    updateProject(companyName: string, project: ICase): ICase;
}