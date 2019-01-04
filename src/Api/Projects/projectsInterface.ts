import { ICase } from './../../Models/case';
import { ICheckpoint } from './../../Models/checkpoint';
import { ISlimCase } from './../../Models/slimCase';

export interface ICaseCreateRequest {
    name: string;
    deadline: string;
    notes: string;
    attachmentUrls: string[];
    doctor?: string;
    companyId: string;
}

export interface ISlimCasesSearchRequest {
    companyId: string;
    limit: number;
    startAfter?: FirebaseFirestore.DocumentSnapshot,
}

export interface ICaseApi {
    getSlimCases(slimCaseSearchRequest: ISlimCasesSearchRequest): Promise<ISlimCase[]>;
    createProject(companyId: string, projectCreateRequest: ICaseCreateRequest): Promise<ICase>;
    getProject(projectId: string): Promise<ICase>;
    getProjectCheckpoints(caseCheckpoints: string[]): Promise<ICheckpoint[]>;
    uploadFile(companyName: string, projectId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot>;
    updateProject(companyName: string, project: ICase): ICase;
}