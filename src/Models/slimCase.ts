export interface ISlimCase {
    currentCheckpointName: string;
    currentCheckpointId: string;
    caseId: string;
    name: string;
    deadline: string;
    doctor: string;
    doctorName: string;
    created: string;
    showNewInfoFrom: 'Doctor' | 'Lab' | null;
    document: FirebaseFirestore.QueryDocumentSnapshot;
}