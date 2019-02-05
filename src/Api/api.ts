import { AuthenticationApi } from './Authentication/authentication'
import { IAuthenticationApi } from './Authentication/authenticationInterface';
import { CaseNotesApi } from './CaseNotesApi/caseNotes';
import { ICaseNotesApi } from './CaseNotesApi/caseNotesInterface';
import { CheckpointsApi } from './Checkpoints/checkpoints';
import { ICheckpointsApi } from './Checkpoints/checkpointsInterface';
import { CompanySelectionApi } from './CompanySelection/companySelection';
import { ICompanySelectionApi } from './CompanySelection/companySelectionInterface';
import { ProjectsApi } from './Projects/projects';
import { ICaseApi } from './Projects/projectsInterface';
import { UsersApi } from './Users/users';
import { IUsersApi } from './Users/usersApiInterface';
import { WorkflowApi } from './Workflow/workflow';
import { IWorkflowApi } from './Workflow/workflowApiInterface';

export interface IApi {
    userApi: IUsersApi;
    authenticationApi: IAuthenticationApi;
    workflowApi: IWorkflowApi;
    projectsApi: ICaseApi;
    checkpointsApi: ICheckpointsApi;
    caseNotesApi: ICaseNotesApi;
    companySelectionApi: ICompanySelectionApi;
}

const api: IApi = {
    userApi: new UsersApi(),
    authenticationApi: new AuthenticationApi(),
    workflowApi: new WorkflowApi(),
    projectsApi: new ProjectsApi(),
    checkpointsApi: new CheckpointsApi(),
    caseNotesApi: new CaseNotesApi(),
    companySelectionApi: new CompanySelectionApi(),
}

export default api;