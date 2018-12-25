export interface ISlimCase {
    currentCheckpointName: string;
    currentCheckpointId: string;
    caseId: string;
    name: string;
    deadline: string;
    doctorId: string;
    doctorName: string;
    created: string;
    showNewInfoFrom: 'doctor' | 'lab' | null;
}