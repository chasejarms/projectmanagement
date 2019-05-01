import { Timestamp } from '@google-cloud/firestore';
import { ShowNewInfoFromType } from './showNewInfoFromTypes';


export interface ISlimCase {
    currentCheckpointName: string;
    currentCheckpointId: string;
    caseId: string;
    deadline: Timestamp;
    doctor: string;
    doctorName: string;
    created: Timestamp;
    showNewInfoFrom: ShowNewInfoFromType.Doctor | ShowNewInfoFromType.Lab | null;
    document: FirebaseFirestore.QueryDocumentSnapshot;
    complete: boolean;
    hasStarted: boolean;
}