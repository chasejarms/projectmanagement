export interface ICase {
    id: string;
    complete: boolean;
    deadline: string;
    doctor: string;
    name: string;
    notes: string;
    attachmentUrls: string[];
    created: string;
    caseCheckpoints: string[];
}