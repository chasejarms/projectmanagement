import { Timestamp } from "@google-cloud/firestore";
import { ICaseCheckpoint } from "./caseCheckpoint";
import { ShowNewInfoFromType } from "./showNewInfoFromTypes";

export interface ICase {
    id: string;
    complete: boolean;
    prescriptionTemplateId: string;
    controlValues: {
        [sectionIdControlId: string]: any;
    };
    created: Timestamp;
    caseCheckpoints: ICaseCheckpoint[];
    showNewInfoFrom: ShowNewInfoFromType.Doctor | ShowNewInfoFromType.Lab | null;
    hasStarted: boolean;
    doctorCompanyUserId: string;
    companyId: string;
    deadline: Timestamp;
    currentDoctorCheckpointName: string;
    currentLabCheckpointName: string;
    doctorName: string;
    currentDoctorCheckpointId: string;
    currentLabCheckpointId: string;
}

export interface IAugmentedCase extends ICase {
    document: FirebaseFirestore.QueryDocumentSnapshot;
}