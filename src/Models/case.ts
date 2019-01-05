import { IAttachmentMetadata } from "./attachmentMetadata";

export interface ICase {
    id: string;
    complete: boolean;
    deadline: string;
    doctor: string;
    name: string;
    notes: string;
    attachmentUrls: IAttachmentMetadata[];
    created: string;
    caseCheckpoints: string[];
}