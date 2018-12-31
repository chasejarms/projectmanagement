import { IWorkflow } from '../Models/workflow';

export const workflow: IWorkflow = [
    {
        id: '1',
        name: 'Finalize Contract',
        estimatedCompletionTime: '1 - 2 days',
        visibleToDoctor: true,
    },
    {
        id: '2',
        name: 'Initial Design Specs',
        estimatedCompletionTime: '2 - 3 days',
        visibleToDoctor: false,
    },
    {
        id: '3',
        name: 'Art Preview',
        estimatedCompletionTime: '1 - 4 days',
        visibleToDoctor: false,
    },
    {
        id: '4',
        name: 'Product Sample',
        estimatedCompletionTime: '1 - 2 days',
        visibleToDoctor: true,
    },
    {
        id: '5',
        name: 'Delivery',
        estimatedCompletionTime: '1 - 3 days',
        visibleToDoctor: true,
    }
];