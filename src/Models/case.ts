import { Timestamp } from "@google-cloud/firestore";
import { ShowNewInfoFromType } from "./showNewInfoFromTypes";

export interface ICase {
    id: string;
    complete: boolean;
    prescriptionFormTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
    created: Timestamp;
    caseCheckpoints: string[];
    showNewInfoFrom: ShowNewInfoFromType.Doctor | ShowNewInfoFromType.Lab | null;
    hasStarted: boolean;
    doctor: string;
    companyId: string;
    deadline: Timestamp;
    currentDoctorCheckpointName: string;
    currentLabCheckpointName: string;
    doctorName: string;
    currentDoctorCheckpoint: string;
    currentLabCheckpoint: string;
}

export interface IAugmentedCase extends ICase {
    document: FirebaseFirestore.QueryDocumentSnapshot;
}