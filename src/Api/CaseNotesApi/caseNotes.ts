import { ICaseNotesApi } from './caseNotesInterface';

export class CaseNotesApi implements ICaseNotesApi {
    public getCaseNotes(companyName: string): string {
        throw new Error("Method not implemented.");
    }

    public updateCaseNotes(companyName: string, updatedCaseNotes: string): string {
        throw new Error("Method not implemented.");
    }
}