export interface ICheckpoint {
    name: string;
    estimatedCompletionTime: string;
    visibleToDoctor: boolean;
    complete: boolean;
    completedBy: string | null;
}