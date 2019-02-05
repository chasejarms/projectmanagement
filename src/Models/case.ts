import { Timestamp } from "@google-cloud/firestore";
import { IAttachmentMetadata } from "./attachmentMetadata";

export interface ICase {
    id: string;
    complete: boolean;
    deadline: Timestamp;
    doctor: string;
    name: string;
    notes: string;
    attachmentUrls: IAttachmentMetadata[];
    created: Timestamp;
    caseCheckpoints: string[];
    hasStarted: boolean;
}