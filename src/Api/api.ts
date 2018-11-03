import { AuthenticationApi } from './Authentication/authentication'
import { IAuthenticationApi } from './Authentication/authenticationInterface';
import { MockAuthenticationApi } from './Authentication/mockAuthentication';
import { CaseNotesApi } from './CaseNotesApi/caseNotes';
import { ICaseNotesApi } from './CaseNotesApi/caseNotesInterface';
import { MockCaseNotesApi } from './CaseNotesApi/mockCaseNotes';
import { CheckpointsApi } from './Checkpoints/checkpoints';
import { ICheckpointsApi } from './Checkpoints/checkpointsInterface';
import { MockCheckpointsApi } from './Checkpoints/mockCheckpoints';
import { mockApiConfig } from './mockApi.config';
import { MockProjectsApi } from './Projects/mockProjects';
import { ProjectsApi } from './Projects/projects';
import { IProjectsApi } from './Projects/projectsInterface';
import { MockUsersApi } from './Users/mockUsers';
import { UsersApi } from './Users/users';
import { IUsersApi } from './Users/usersApiInterface';
import { MockWorkflowApi } from './Workflow/mockWorkflow';
import { WorkflowApi } from './Workflow/workflow';
import { IWorkflowApi } from './Workflow/workflowApiInterface';

const useMockApi: boolean = true;

export interface IApi {
    userApi: IUsersApi;
    authenticationApi: IAuthenticationApi;
    workflowApi: IWorkflowApi;
    projectsApi: IProjectsApi;
    checkpointsApi: ICheckpointsApi;
    caseNotesApi: ICaseNotesApi;
}

const mockWorkflowApi = new MockWorkflowApi(mockApiConfig.defaultWorkflow);

const mockApi: IApi = {
    userApi: new MockUsersApi(mockApiConfig.defaultCompanyUsers),
    authenticationApi: new MockAuthenticationApi(),
    workflowApi: mockWorkflowApi,
    projectsApi: new MockProjectsApi(mockApiConfig.defaultProjects),
    checkpointsApi: new MockCheckpointsApi(mockWorkflowApi),
    caseNotesApi: new MockCaseNotesApi(),
}

const api: IApi = {
    userApi: new UsersApi(),
    authenticationApi: new AuthenticationApi(),
    workflowApi: new WorkflowApi(),
    projectsApi: new ProjectsApi(),
    checkpointsApi: new CheckpointsApi(),
    caseNotesApi: new CaseNotesApi(),
}

export default (useMockApi ? mockApi : api);