import { ICaseCheckpoint } from 'src/Models/caseCheckpoint';
import { ICaseFilter } from 'src/Models/caseFilter/caseFilter';
import { ShowNewInfoFromType } from 'src/Models/showNewInfoFromTypes';
import { ICase } from './../../Models/case';

export interface ICaseCreateRequest {
    id: string;
    prescriptionTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
}

export interface ICasesSearchRequest extends ICaseFilter {
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
    searchCases(searchRequest: ICasesSearchRequest, userType: string, userId: string): Promise<FirebaseFirestore.QueryDocumentSnapshot[]>;
    createProject(companyId: string, projectCreateRequest: ICaseCreateRequest): Promise<ICase>;
    getProject(projectId: string): Promise<ICase>;
    uploadFile(companyName: string, projectId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot>;
    updateProject(companyName: string, project: ICase): ICase;
    updateCaseInformation(caseId: string, updateCaseInformationRequest: IUpdateCaseInformationRequest, showNewInfoFrom: ShowNewInfoFromType): Promise<void>;
    removeFile(fileName: string): Promise<void>;
    getNewCases(companyId: string): Promise<ICase[]>;
    updateCaseCheckpoints(caseId: string, caseCheckpoints: ICaseCheckpoint[]): Promise<boolean>;
    markProjectUpdatesAsSeen(companyId: string, caseId: string): Promise<void>;
    canCreateCases(companyId: string): Promise<boolean>;
}