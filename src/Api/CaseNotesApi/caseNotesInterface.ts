export interface ICaseNotesApi {
    getCaseNotes(companyName: string): Promise<string>;
    updateCaseNotes(companyName: string, updatedCaseNotes: string): Promise<void>;
}