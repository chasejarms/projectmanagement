import * as _ from 'lodash';
import { slimProjects as mockSlimProjects } from './../../MockData/slimProjects';
import { ICheckpoint } from './../../Models/checkpoint';
import { IMessage } from './../../Models/message';
import { IProject } from './../../Models/project';
import { IProjectCreationProjectUser } from './../../Models/projectUser';
import { ISlimProjects } from './../../Models/slimProject';
import { mockApiKey } from './../mockApi.key';
import { IProjectsApi } from './projectsInterface';

export const slimProjectsKey = `${mockApiKey}slimProjects`;
export const largeProjectsKey = `${mockApiKey}largeProjects`;
export const projectStaffChatKey = `${mockApiKey}projectStaffChat`;
export const projectUserChatKey = `${mockApiKey}projectUserChat`;

export class MockProjectsApi implements IProjectsApi {
    constructor(defaultProject: boolean) {
        const projects = this.getSlimProjects('does not matter');
        const projectsAlreadyExist = !!projects && !!projects.length;
        this.setUpSlimProjects(defaultProject, projectsAlreadyExist);
    }

    public getSlimProjects(companyName: string): ISlimProjects[] {
        const stringifiedSlimProjects = localStorage.getItem(slimProjectsKey);
        const slimProjects = JSON.parse(stringifiedSlimProjects!);
        return _.cloneDeep(slimProjects);
    }

    public getMySlimProjects(companyName: string): ISlimProjects[] {
        const slimProjects = this.getSlimProjects(companyName);
        const mySlimProjects = slimProjects.filter((slimProject: ISlimProjects) => {
            return true;
        });
        return mySlimProjects;
    }

    public createProject(companyName: string, project: IProject): IProject {
        this.createSlimProjectFromProject(project);
        const createdLargeProject = this.createLargeProjectFromProject(project);
        return createdLargeProject;
    }

    public getProjectCheckpoints(companyName: string, projectId: string): ICheckpoint[] {
        const project = this.getProject(projectId);
        return project.checkpoints.map((checkpoint) => {
            checkpoint.deadline = new Date(checkpoint.deadline!);
            return checkpoint;
        });
    }

    public getProjectName(companyName: string, projectId: string): string {
        const project = this.getProject(projectId);
        return project.name;
    }

    public getProjectUsers(companyName: string, projectId: string): IProjectCreationProjectUser[] {
        const project = this.getProject(projectId);
        return project.users;
    }

    public getStaffMessages(companyName: string, projectId: string): IMessage[] {
        const stringifiedStaffMessages = localStorage.getItem(projectStaffChatKey + projectId)!;
        const staffMessages = JSON.parse(stringifiedStaffMessages);
        return staffMessages.map((message: IMessage) => {
            message.created = new Date(message.created);
            return message;
        })
    }

    public getCustomerMessages(companyName: string, projectId: string): IMessage[] {
        const stringifiedCustomerMessages = localStorage.getItem(projectUserChatKey + projectId)!;
        const customerMessages = JSON.parse(stringifiedCustomerMessages);
        return customerMessages.map((message: IMessage) => {
            message.created = new Date(message.created);
            return message;
        })
    }

    public createStaffMessage(companyName: string, projectId: string, message: IMessage): IMessage {
        const staffMessages = this.getStaffMessages(companyName, projectId);
        const staffMessagesWithAddedMessage = staffMessages.concat([message]);
        const stringifiedStaffMessages = JSON.stringify(staffMessagesWithAddedMessage);
        localStorage.setItem(
            projectStaffChatKey + projectId,
            stringifiedStaffMessages,
        );
        return message;
    }

    public createCustomerMessage(companyName: string, projectId: string, message: IMessage): IMessage {
        const customerMessages = this.getCustomerMessages(companyName, projectId);
        const customerMessagesWithAddedMessage = customerMessages.concat([message]);
        const stringifiedCustomerMessages = JSON.stringify(customerMessagesWithAddedMessage);
        localStorage.setItem(
            projectUserChatKey + projectId,
            stringifiedCustomerMessages,
        );
        return message;
    }

    private getProject(projectId: string): IProject {
        const stringifiedProject = localStorage.getItem(largeProjectsKey + projectId);
        return JSON.parse(stringifiedProject!);
    }

    private setUpSlimProjects(defaultProject: boolean, projectsAlreadyExist: boolean) {
        if (defaultProject && !projectsAlreadyExist) {
            localStorage.setItem(
                slimProjectsKey,
                JSON.stringify(mockSlimProjects),
            )
        } else if (!projectsAlreadyExist) {
            localStorage.setItem(
                slimProjectsKey,
                JSON.stringify([]),
            )
        }
    }

    // private updateSlimProjectFromProject(project: IProject): void {
    //     const existingSlimProjects = this.getSlimProjects('does not matter');
    //     const existingProjectData = existingSlimProjects.filter((existingSlimProject) => {
    //         return existingSlimProject.projectId === project.id;
    //     })[0];
    //     const deadline = this.nextCheckpointDeadline(project);
    //     const slimProjectToUpdate: ISlimProjects = {
    //         ...existingProjectData,
    //         projectName: project.name,
    //         completionPercentage: this.completedCheckpoints(project),
    //         currentCheckpoint: this.currentCheckpoint(project),
    //         deadline,
    //         deadlinePretty: this.createPrettyDeadline(deadline),
    //     }

    //     const updatedSlimProjects = existingSlimProjects.map((existingSlimProject) => {
    //         if (existingSlimProject.projectId === project.id) {
    //             return slimProjectToUpdate;
    //         } else {
    //             return existingSlimProject;
    //         }
    //     });
    //     const stringifiedUpdatedSlimProjects = JSON.stringify(updatedSlimProjects);
    //     localStorage.setItem(
    //         slimProjectsKey,
    //         stringifiedUpdatedSlimProjects,
    //     );
    // }

    private createSlimProjectFromProject(project: IProject): void {
        const deadline = this.nextCheckpointDeadline(project);
        const slimProjectToUpdate: ISlimProjects = {
            id: Date.now().toString(),
            projectId: project.id,
            projectName: project.name,
            completionPercentage: this.completedCheckpoints(project),
            currentCheckpoint: this.currentCheckpoint(project),
            deadline,
            nextCheckpointDeadlinePretty: this.createPrettyDeadline(deadline),
        }

        const existingSlimProjects = this.getSlimProjects('does not matter');
        const slimProjectsWithNewProject = existingSlimProjects.concat([slimProjectToUpdate]);
        const stringifiedSlimProjects = JSON.stringify(slimProjectsWithNewProject);
        localStorage.setItem(
            slimProjectsKey,
            stringifiedSlimProjects,
        )
    }

    private createLargeProjectFromProject(project: IProject): IProject {
        const stringifiedLargeProject = JSON.stringify(project);
        localStorage.setItem(
            largeProjectsKey + project.id,
            stringifiedLargeProject,
        )

        const staffChat = JSON.stringify([]);
        const userChat = JSON.stringify([]);

        localStorage.setItem(
            projectStaffChatKey + project.id,
            staffChat,
        )

        localStorage.setItem(
            projectUserChatKey + project.id,
            userChat,
        )

        return project;
    }

    private completedCheckpoints(project: IProject): number {
        const completedCheckpoints = project.checkpoints.filter((checkpoint) => {
            return checkpoint.complete;
        }).length;
        const allCheckpoints = project.checkpoints.length;

        return Math.round(completedCheckpoints / allCheckpoints);
    }

    private currentCheckpoint(project: IProject): string {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < project.checkpoints.length; i++) {
            const currentCheckpoint = project.checkpoints[i];
            if (!currentCheckpoint.complete) {
                return currentCheckpoint.name;
            }
        }
        return '';
    }

    private nextCheckpointDeadline(project: IProject): Date {
        for (const checkpoint of project.checkpoints) {
            if (!checkpoint.complete) {
                return checkpoint.deadline!;
            }
        }
        return new Date();
    }

    private createPrettyDeadline(deadline: Date): string {
        const day = deadline.getDate();
        const month = deadline.getMonth() + 1;
        const year = deadline.getFullYear();

        return `${month}/${day}/${year}`;
    }
}