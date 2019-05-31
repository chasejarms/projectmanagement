import { IProjectCheckpoint } from 'src/Models/caseCheckpoint';
import { IProjectFilter } from 'src/Models/caseFilter/caseFilter';
import { ShowNewInfoFromType } from 'src/Models/showNewInfoFromTypes';
import { IProject } from '../../Models/project';

export interface IProjectCreateRequest {
    id: string;
    prescriptionTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
}

export interface IProjectsSearchRequest extends IProjectFilter {
    companyId: string;
    limit: number;
    startAfter?: FirebaseFirestore.DocumentSnapshot,
    startAt?: FirebaseFirestore.DocumentSnapshot,
}

export interface IGetCaseCheckpointsRequest {
    companyId: string;
    projectId: string;
}

export interface IUpdateCaseInformationRequest {
    controlValues: {
        [sectionIdControlId: string]: any;
    }
}

export interface IProjectApi {
    searchCases(searchRequest: IProjectsSearchRequest, userType: string, companyUserId: string): Promise<FirebaseFirestore.QueryDocumentSnapshot[]>;
    createProject(companyId: string, projectCreateRequest: IProjectCreateRequest): Promise<IProject>;
    getProject(projectId: string): Promise<IProject>;
    uploadFile(companyName: string, projectId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot>;
    updateProject(companyName: string, project: IProject): IProject;
    updateCaseInformation(projectId: string, updateCaseInformationRequest: IUpdateCaseInformationRequest, showNewInfoFrom: ShowNewInfoFromType): Promise<void>;
    removeFile(fileName: string): Promise<void>;
    getNewCases(companyId: string): Promise<IProject[]>;
    updateCaseCheckpoints(projectId: string, caseCheckpoints: IProjectCheckpoint[]): Promise<boolean>;
    markProjectUpdatesAsSeen(companyId: string, projectId: string): Promise<void>;
    canCreateCases(companyId: string): Promise<boolean>;
}