// import { ICheckpoint } from './../../Models/checkpoint';
// import { IMessage } from './../../Models/message';
import { ISlimProjects } from './../../Models/slimProject';

export interface IProjectsApi {
    getSlimProjects(companyName: string): ISlimProjects[];
    // getMySlimProjects(companyName: string): ISlimProjects[];
    // getProjectCheckpoints(companyName: string, projectId: string): ICheckpoint[];
    // updateProjectCheckpoints(companyName: string, projectId: string, checkpoints: ICheckpoint[]): boolean;
    // getProjectUsers(companyName: string, projectId: string): any; // should return project users
    // addProjectUser(companyName: string, projectId: string, user: any): boolean;
    // deleteProjectUser(companyName: string, projectId: string, projectUserId: string): boolean;
    // updateProjectUser(companyName: string, projectId: string, user: any): boolean;
    // getStaffMessages(companyName: string, projectId: string, message: IMessage): IMessage[];
    // updateStaffMessage(companyName: string, projectId: string, message: IMessage): IMessage;
    // createStaffMessage(companyName: string, projectId: string, message: IMessage): IMessage;
    // deleteStaffMessage(companyName: string, projectId: string, messageId: string): boolean;
    // getCustomerMessages(companyName: string, projectId: string, message: IMessage): IMessage[];
    // updateCustomerMessage(companyName: string, projectId: string, message: IMessage): IMessage;
    // createCustomerMessage(companyName: string, projectId: string, message: IMessage): IMessage;
    // deleteCustomerMessage(companyName: string, projectId: string, messageId: string): boolean;
}