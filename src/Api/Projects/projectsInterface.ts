import { IAttachmentMetadata } from 'src/Models/attachmentMetadata';
import { IAugmentedCheckpoint } from './../../Models/augmentedCheckpoint';
import { ICase } from './../../Models/case';
import { ISlimCase } from './../../Models/slimCase';

export interface ICaseCreateRequest {
    name: string;
    deadline: string;
    notes: string;
    attachmentUrls: IAttachmentMetadata[];
    doctor?: string;
    companyId: string;
    idForCase: string;
}

export interface ISlimCasesSearchRequest {
    companyId: string;
    limit: number;
    startAfter?: FirebaseFirestore.DocumentSnapshot,
}

export interface IGetCaseCheckpointsRequest {
    companyId: string;
    caseId: string;
}

export interface IUpdateCaseInformationRequest {
    name: string;
    deadline: string;
    notes: string;
}

export interface ICaseApi {
    getSlimCases(slimCaseSearchRequest: ISlimCasesSearchRequest): Promise<ISlimCase[]>;
    createProject(companyId: string, projectCreateRequest: ICaseCreateRequest): Promise<ICase>;
    getProject(projectId: string): Promise<ICase>;
    getProjectCheckpoints(getCaseRequest: IGetCaseCheckpointsRequest): Promise<IAugmentedCheckpoint[]>;
    uploadFile(companyName: string, projectId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot>;
    updateProject(companyName: string, project: ICase): ICase;
    updateCaseInformation(caseId: string, updateCaseInformationRequest: IUpdateCaseInformationRequest): Promise<void>;
    removeFile(fileName: string): Promise<void>;
}