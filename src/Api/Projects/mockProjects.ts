import * as _ from 'lodash';
import { slimProjects as mockSlimProjects } from './../../MockData/slimProjects';
import { ICheckpoint } from './../../Models/checkpoint';
import { IProject } from './../../Models/project';
import { ISlimProject } from './../../Models/slimProject';
import { mockApiKey } from './../mockApi.key';
import { IProjectsApi } from './projectsInterface';
import { IProjectCreateRequest } from './projectsInterface';

export const slimProjectsKey = `${mockApiKey}slimProjects`;
export const largeProjectsKey = `${mockApiKey}largeProjects`;

export class MockProjectsApi implements IProjectsApi {
    constructor(defaultProject: boolean) {
        this.getSlimProjects('does not matter').then((projects) => {
            const projectsAlreadyExist = !!projects && !!projects.length;
            this.setUpSlimProjects(defaultProject, projectsAlreadyExist);
        });
    }

    public getSlimProjects(companyName: string): Promise<ISlimProject[]> {
        const stringifiedSlimProjects = localStorage.getItem(slimProjectsKey);
        const slimProjects = JSON.parse(stringifiedSlimProjects!);
        return Promise.resolve(_.cloneDeep(slimProjects));
    }

    public async createProject(companyName: string, projectCreateRequest: IProjectCreateRequest): Promise<IProject> {
        const project: IProject = {
            id: Date.now().toString(),
            name: projectCreateRequest.name,
            deadline: projectCreateRequest.deadline,
            checkpoints: [],
            complete: false,
            doctor: 'Bob',
            notes: projectCreateRequest.notes,
            attachments: [],
        }
        this.createSlimProjectFromProject(project);
        const createdLargeProject = this.createLargeProjectFromProject(project);
        return createdLargeProject;
    }

    public getProjectCheckpoints(companyName: string, projectId: string): ICheckpoint[] {
        const project = this.getProject(projectId);
        return project.checkpoints;
    }

    public getProject(projectId: string): IProject {
        const stringifiedProject = localStorage.getItem(largeProjectsKey + projectId);
        const project = JSON.parse(stringifiedProject!);
        return project;
    }

    public updateProject(companyName: string, project: IProject): IProject {
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
    //     const deadline = this.nextCheckpointDeadline(project);
    //     const slimProjectToUpdate: ISlimProject = {
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

    private async createSlimProjectFromProject(project: IProject): Promise<void> {
        const deadline = this.nextCheckpointDeadline(project);
        const slimProjectToUpdate: ISlimProject = {
            id: Date.now().toString(),
            projectId: project.id,
            projectName: project.name,
            currentCheckpoint: this.currentCheckpoint(project),
            deadline: deadline.toUTCString(),
            showNewInfoFrom: null,
        }

        const existingSlimProjects = await this.getSlimProjects('does not matter');
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

        return project;
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
        return new Date();
    }
}