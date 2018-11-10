import { ISlimProject } from './../Models/slimProject';
const today = new Date();
export const slimProjects: ISlimProject[] = [
    {
        projectName: 'Podium Grand Opening',
        completionPercentage: 70,
        currentCheckpoint: 'Art Work',
        deadline: new Date(),
        id: '4234',
        projectId: '23423',
        nextCheckpointDeadlinePretty: `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`,
        showNewInfoFrom: null,
    },
    {
        projectName: 'Aptive Summer Contest',
        completionPercentage: 15,
        currentCheckpoint: 'Negotiation',
        deadline: new Date(),
        id: '45234',
        projectId: '45slkj',
        nextCheckpointDeadlinePretty: `${today.getMonth() + 1}/${today.getDate() + 4}/${today.getFullYear()}`,
        showNewInfoFrom: null,
    },
    {
        projectName: 'Aptive Team Gear',
        completionPercentage: 90,
        currentCheckpoint: 'Manufacturing',
        deadline: new Date(),
        id: 'ser2',
        projectId: '234l3asd',
        nextCheckpointDeadlinePretty: `${today.getMonth() + 1}/${today.getDate() + 2}/${today.getFullYear()}`,
        showNewInfoFrom: null,
    },
    {
        projectName: 'Hawks Executive Branding',
        completionPercentage: 12,
        currentCheckpoint: 'Initial Client Meeting',
        deadline: new Date(),
        id: '34lks',
        projectId: 'wxcvaelj',
        nextCheckpointDeadlinePretty: `${today.getMonth() + 1}/${today.getDate() + 1}/${today.getFullYear()}`,
        showNewInfoFrom: null,
    },
]