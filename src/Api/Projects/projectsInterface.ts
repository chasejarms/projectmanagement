import { Timestamp } from '@google-cloud/firestore';
import { IAttachmentMetadata } from 'src/Models/attachmentMetadata';
import { IAugmentedCheckpoint } from './../../Models/augmentedCheckpoint';
import { ICase } from './../../Models/case';

export interface ICaseCreateRequest {
    name: string;
    deadline: Timestamp;
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
    startAt?: FirebaseFirestore.DocumentSnapshot,
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
    getSlimCases(slimCaseSearchRequest: ISlimCasesSearchRequest, userType: string, userId: string): Promise<FirebaseFirestore.QueryDocumentSnapshot[]>;
    createProject(companyId: string, projectCreateRequest: ICaseCreateRequest): Promise<ICase>;
    getProject(projectId: string): Promise<ICase>;
    getProjectCheckpoints(getCaseRequest: IGetCaseCheckpointsRequest): Promise<IAugmentedCheckpoint[]>;
    uploadFile(companyName: string, projectId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot>;
    updateProject(companyName: string, project: ICase): ICase;
    updateCaseInformation(caseId: string, updateCaseInformationRequest: IUpdateCaseInformationRequest): Promise<void>;
    removeFile(fileName: string): Promise<void>;
    getNewCases(companyId: string): Promise<ICase[]>;
    updateCaseCheckpoint(checkpointId: string, complete: boolean, completedBy?: string): Promise<boolean>;
}