import { ShowNewInfoFromType } from 'src/Models/showNewInfoFromTypes';
import { IAugmentedCheckpoint } from './../../Models/augmentedCheckpoint';
import { ICase } from './../../Models/case';

export interface ICaseCreateRequest {
    id: string;
    prescriptionFormTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
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
    controlValues: {
        [sectionIdControlId: string]: any;
    }
}

export interface ICaseApi {
    getSlimCases(slimCaseSearchRequest: ISlimCasesSearchRequest, userType: string, userId: string): Promise<FirebaseFirestore.QueryDocumentSnapshot[]>;
    createProject(companyId: string, projectCreateRequest: ICaseCreateRequest): Promise<ICase>;
    getProject(projectId: string): Promise<ICase>;
    getProjectCheckpoints(getCaseRequest: IGetCaseCheckpointsRequest): Promise<IAugmentedCheckpoint[]>;
    uploadFile(companyName: string, projectId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot>;
    updateProject(companyName: string, project: ICase): ICase;
    updateCaseInformation(caseId: string, updateCaseInformationRequest: IUpdateCaseInformationRequest, showNewInfoFrom: ShowNewInfoFromType): Promise<void>;
    removeFile(fileName: string): Promise<void>;
    getNewCases(companyId: string): Promise<ICase[]>;
    updateCaseCheckpoint(checkpointId: string, complete: boolean, completedBy?: string): Promise<boolean>;
    markProjectUpdatesAsSeen(companyId: string, caseId: string): Promise<void>;
}