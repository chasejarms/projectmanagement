export interface ISlimCase {
    currentCheckpointName: string;
    currentCheckpointId: string;
    caseId: string;
    name: string;
    deadline: string;
    doctor: string;
    doctorName: string;
    created: string;
    showNewInfoFrom: 'doctor' | 'lab' | null;
}