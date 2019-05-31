import { Timestamp } from "@google-cloud/firestore";
import { IProjectCheckpoint } from "./caseCheckpoint";

export interface IProject {
    projectCheckpoints: IProjectCheckpoint[];
    id: string;
    complete: boolean;
    created: Timestamp;
    hasStarted: boolean;
    companyId: string;
    deadline: Timestamp;
    name: string;
    description: string;
    currentProjectCheckpointName: string;
    currentProjectCheckpointId: string;
}

export interface IAugmentedProject extends IProject {
    document: FirebaseFirestore.QueryDocumentSnapshot;
}