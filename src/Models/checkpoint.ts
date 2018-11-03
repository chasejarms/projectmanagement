export interface ICheckpoint {
    name: string;
    estimatedCompletionTime: string;
    visibleToCustomer: boolean;
    description?: string;
    complete: boolean;
    projectId: string;
    id: string;
}