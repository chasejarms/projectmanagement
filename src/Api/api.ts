import { AuthenticationApi } from './Authentication/authentication'
import { IAuthenticationApi } from './Authentication/authenticationInterface';
import { CompanySelectionApi } from './CompanySelection/companySelection';
import { ICompanySelectionApi } from './CompanySelection/companySelectionInterface';
import { ContactUsApi } from './ContactUs/contactUs';
import { IContactUsApi } from './ContactUs/contactUsInterface';
import { PrescriptionTemplateApi } from './PrescriptionTemplate/prescriptionTemplate';
import { IPrescriptionTemplateApi } from './PrescriptionTemplate/prescriptionTemplateInterface';
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
    companySelectionApi: ICompanySelectionApi;
    prescriptionTemplateApi: IPrescriptionTemplateApi;
    contactUsApi: IContactUsApi;
}

const api: IApi = {
    userApi: new UsersApi(),
    authenticationApi: new AuthenticationApi(),
    workflowApi: new WorkflowApi(),
    projectsApi: new ProjectsApi(),
    companySelectionApi: new CompanySelectionApi(),
    prescriptionTemplateApi: new PrescriptionTemplateApi(),
    contactUsApi: new ContactUsApi(),
}

export default api;