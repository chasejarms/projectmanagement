import { IWorkflow } from '../Models/workflow';

export const workflow: IWorkflow = {
    id: '1',
    checkpoints: [
        {
            name: 'Finalize Contract',
            estimatedCompletionTime: '1 - 2 days',
            visibleToDoctor: true,
        },
        {
            name: 'Initial Design Specs',
            estimatedCompletionTime: '2 - 3 days',
            visibleToDoctor: false,
        },
        {
            name: 'Art Preview',
            estimatedCompletionTime: '1 - 4 days',
            visibleToDoctor: false,
        },
        {
            name: 'Product Sample',
            estimatedCompletionTime: '1 - 2 days',
            visibleToDoctor: true,
        },
        {
            name: 'Delivery',
            estimatedCompletionTime: '1 - 3 days',
            visibleToDoctor: true,
        }
    ],
}