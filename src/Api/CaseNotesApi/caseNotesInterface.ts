export interface ICaseNotesApi {
    getCaseNotes(companyId: string): Promise<string>;
    updateCaseNotes(companyId: string, updatedCaseNotes: string): Promise<void>;
}