import { Timestamp } from "@google-cloud/firestore";
import { IAttachmentMetadata } from "./attachmentMetadata";
import { IPatientGender } from "./patientGender";
import { ShowNewInfoFromType } from './showNewInfoFromTypes';

export interface ICaseV1 {
    id: string;
    complete: boolean;
    dueDate: Timestamp;
    doctor: string;
    patientName: string;
    patientGender: IPatientGender;
    caseCertifiedByDoctor: boolean;
    units: string[];
    caseNotes: string;
    attachmentUrls: IAttachmentMetadata[];
    caseCheckpoints: string[];
    ShowNewInfoFromType: ShowNewInfoFromType.Doctor | ShowNewInfoFromType.Lab | null;
    hasStarted: boolean;
}