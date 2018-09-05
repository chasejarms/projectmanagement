import { IWorkflow } from '../Models/workflow';

export const workflow: IWorkflow = {
    id: '1',
    checkpoints: [
        {
            name: 'Finalize Contract',
            deadlineFromLastCheckpoint: 1,
            publicCheckpoint: false,
        },
        {
            name: 'Initial Design Specs',
            deadlineFromLastCheckpoint: 4,
            publicCheckpoint: true,
        },
        {
            name: 'Art Preview',
            description: 'Working with our designers, we create tech packs and finalize art work',
            deadlineFromLastCheckpoint: 3,
            publicCheckpoint: true,
        },
        {
            name: 'Product Sample',
            description: 'The manufacturer will give us back an exact duplicate of what we can expect the product to look like',
            deadlineFromLastCheckpoint: 5,
            publicCheckpoint: true,
        },
        {
            name: 'Delivery',
            deadlineFromLastCheckpoint: 4,
            publicCheckpoint: true,
        }
    ],
}