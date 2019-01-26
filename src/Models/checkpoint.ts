export interface ICheckpoint {
    id: string;
    name: string;
    estimatedCompletionTime: string;
    visibleToDoctor: boolean;
    complete: boolean;
    completedBy: string | null;
}