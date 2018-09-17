import * as _ from 'lodash';
import { slimProjects as mockSlimProjects } from './../../MockData/slimProjects';
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
}