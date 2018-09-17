import { AuthenticationApi } from './Authentication/authentication'
import { IAuthenticationApi } from './Authentication/authenticationInterface';
import { MockAuthenticationApi } from './Authentication/mockAuthentication';
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
}

const mockApi: IApi = {
    userApi: new MockUsersApi(mockApiConfig.defaultCompanyUsers),
    authenticationApi: new MockAuthenticationApi(),
    workflowApi: new MockWorkflowApi(mockApiConfig.defaultWorkflow),
    projectsApi: new MockProjectsApi(mockApiConfig.defaultProjects),
}

const api: IApi = {
    userApi: new UsersApi(),
    authenticationApi: new AuthenticationApi(),
    workflowApi: new WorkflowApi(),
    projectsApi: new ProjectsApi(),
}

export default (useMockApi ? mockApi : api);