export interface ICaseNotesApi {
    getCaseNotes(companyName: string): string;
    updateCaseNotes(companyName: string, updatedCaseNotes: string): string;
}