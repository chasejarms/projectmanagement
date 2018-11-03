import { mockApiKey } from './../mockApi.key';
import { ICaseNotesApi } from './caseNotesInterface';

export const caseNotesKey = `${mockApiKey}caseNotes`;

export class MockCaseNotesApi implements ICaseNotesApi {
    public getCaseNotes(companyName: string): string {
        if (localStorage.getItem(caseNotesKey) === null) {
            localStorage.setItem(caseNotesKey, '');
        }

        return localStorage.getItem(caseNotesKey)!;
    }

    public updateCaseNotes(companyName: string, updatedCaseNotes: string): string {
        localStorage.setItem(caseNotesKey, updatedCaseNotes);
        return updatedCaseNotes;
    }
}