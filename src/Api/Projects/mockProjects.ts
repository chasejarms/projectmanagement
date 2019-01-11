import * as _ from 'lodash';
import { IAugmentedCheckpoint } from 'src/Models/augmentedCheckpoint';
import { slimCases as mockSlimProjects } from './../../MockData/slimProjects';
import { ICase } from './../../Models/case';
import { ICheckpoint } from './../../Models/checkpoint';
import { ISlimCase } from './../../Models/slimCase';
import { mockApiKey } from './../mockApi.key';
import { ICaseApi, IGetCaseCheckpointsRequest, ISlimCasesSearchRequest, IUpdateCaseInformationRequest } from './projectsInterface';
import { ICaseCreateRequest } from './projectsInterface';

export const slimProjectsKey = `${mockApiKey}slimProjects`;
export const largeProjectsKey = `${mockApiKey}largeProjects`;

export class MockProjectsApi implements ICaseApi {
    constructor(defaultProject: boolean) {
        this.getSlimCases('does not matter' as any).then((projects) => {
            const projectsAlreadyExist = !!projects && !!projects.length;
            this.setUpSlimProjects(defaultProject, projectsAlreadyExist);
        });
    }

    public getSlimCases(slimCasesSearchRequest: ISlimCasesSearchRequest): Promise<ISlimCase[]> {
        const stringifiedSlimProjects = localStorage.getItem(slimProjectsKey);
        const slimProjects = JSON.parse(stringifiedSlimProjects!);
        return Promise.resolve(_.cloneDeep(slimProjects));
    }

    public async createProject(companyName: string, projectCreateRequest: ICaseCreateRequest): Promise<ICase> {
        const project: ICase = {
            id: '5',
            name: projectCreateRequest.name,
            deadline: projectCreateRequest.deadline,
            caseCheckpoints: [],
            complete: false,
            doctor: 'Bob',
            notes: projectCreateRequest.notes,
            attachmentUrls: [],
            created: Date.now().toString(),
            hasStarted: true,
        }
        this.createSlimProjectFromProject(project);
        const createdLargeProject = this.createLargeProjectFromProject(project);
        return createdLargeProject;
    }

    public async getProjectCheckpoints(getCaseRequest: IGetCaseCheckpointsRequest): Promise<IAugmentedCheckpoint[]> {
        // const project = await this.getProject(companyName, projectId);
        return [];
    }

    public getProject(projectId: string): Promise<ICase> {
        const stringifiedProject = localStorage.getItem(largeProjectsKey + projectId);
        const project = JSON.parse(stringifiedProject!);
        return project;
    }

    public updateProject(companyName: string, project: ICase): ICase {
        return {} as any;
    }

    public uploadFile(companyName: string, projectId: string, file: File): Promise<firebase.storage.UploadTaskSnapshot> {
        throw new Error("Method not implemented");
    }

    public removeFile(filePath: string): Promise<void> {
        throw new Error("Method not implemented");
    }

    public updateCaseInformation(caseId: string, updateCaseInformationRequest: IUpdateCaseInformationRequest): Promise<void> {
        throw new Error("Method not implemented");
    }


    public async getNewCases(companyId: string): Promise<ICase[]> {
        throw new Error("Method not implemented");
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

    // private updateSlimProjectFromProject(project: ICase): void {
    //     const existingSlimProjects = this.getSlimCases('does not matter');
    //     const existingProjectData = existingSlimProjects.filter((existingSlimProject) => {
    //         return existingSlimProject.projectId === project.id;
    //     })[0];
    //     const deadline = this.nextCheckpointDeadline(project);
    //     const slimProjectToUpdate: ISlimCase = {
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

    private async createSlimProjectFromProject(project: ICase): Promise<void> {
        const deadline = this.nextCheckpointDeadline(project);
        const slimProjectToUpdate: ISlimCase = {
            currentCheckpointName: this.currentCheckpoint(project).name,
            currentCheckpointId: '5',
            caseId: project.id,
            name: project.name,
            deadline: deadline.toUTCString(),
            doctorId: '1',
            doctorName: 'Tom\'s Dentistry',
            showNewInfoFrom: null,
            created: deadline.toUTCString(),
        } as any;

        const existingSlimProjects = await this.getSlimCases('does not matter' as any);
        const slimProjectsWithNewProject = existingSlimProjects.concat([slimProjectToUpdate]);
        const stringifiedSlimProjects = JSON.stringify(slimProjectsWithNewProject);
        localStorage.setItem(
            slimProjectsKey,
            stringifiedSlimProjects,
        )
    }

    private createLargeProjectFromProject(project: ICase): ICase {
        const stringifiedLargeProject = JSON.stringify(project);
        localStorage.setItem(
            largeProjectsKey + project.id,
            stringifiedLargeProject,
        )

        return project;
    }

    private currentCheckpoint(project: ICase): ICheckpoint {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < project.caseCheckpoints.length; i++) {
            // const currentCheckpoint = project.caseCheckpoints[i];
            return {} as any;
        }

        return {} as any;
    }

    private nextCheckpointDeadline(project: ICase): Date {
        return new Date();
    }
}