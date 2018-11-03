export interface ICheckpoint {
    name: string;
    estimatedTimeframe: string;
    visibleToCustomer: boolean;
    description?: string;
    complete: boolean;
    projectId: string;
    id: string;
}