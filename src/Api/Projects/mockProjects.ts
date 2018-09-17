import * as _ from 'lodash';
import { slimProjects as mockSlimProjects } from './../../MockData/slimProjects';
import { IProject } from './../../Models/project';
import { ISlimProjects } from './../../Models/slimProject';
import { mockApiKey } from './../mockApi.key';
import { IProjectsApi } from './projectsInterface';

export const slimProjectsKey = `${mockApiKey}slimProjects`;
export const projectCheckpointsKey = `${mockApiKey}projectCheckpoints`;
export const projectUsersKey = `${mockApiKey}projectUsers`;
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

    public createProject(companyName: string, project: IProject): IProject {
        // tslint:disable-next-line:no-console
        console.log(project);
        this.createSlimProjectFromProject(project);
        return {} as any;
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
    //     const deadline = this.projectDeadline(project);
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
        const deadline = this.projectDeadline(project);
        const slimProjectToUpdate: ISlimProjects = {
            id: Date.now().toString(),
            projectId: project.id,
            projectName: project.name,
            completionPercentage: this.completedCheckpoints(project),
            currentCheckpoint: this.currentCheckpoint(project),
            deadline,
            deadlinePretty: this.createPrettyDeadline(deadline),
        }

        const existingSlimProjects = this.getSlimProjects('does not matter');
        const slimProjectsWithNewProject = existingSlimProjects.concat([slimProjectToUpdate]);
        const stringifiedSlimProjects = JSON.stringify(slimProjectsWithNewProject);
        localStorage.setItem(
            slimProjectsKey,
            stringifiedSlimProjects,
        )
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

    private projectDeadline(project: IProject): Date {
        const lastCheckpoint = project.checkpoints[project.checkpoints.length - 1];
        return lastCheckpoint.deadline!;
    }

    private createPrettyDeadline(deadline: Date): string {
        const day = deadline.getDate();
        const month = deadline.getMonth() + 1;
        const year = deadline.getFullYear();

        return `${month}/${day}/${year}`;
    }
}