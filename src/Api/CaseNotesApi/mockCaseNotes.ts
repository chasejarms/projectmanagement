import { mockApiKey } from './../mockApi.key';
import { ICaseNotesApi } from './caseNotesInterface';

export const caseNotesKey = `${mockApiKey}caseNotes`;

export class MockCaseNotesApi implements ICaseNotesApi {
    public getCaseNotes(companyName: string): Promise<string> {
        if (localStorage.getItem(caseNotesKey) === null) {
            localStorage.setItem(caseNotesKey, '');
        }

        const caseNotes = localStorage.getItem(caseNotesKey)!;
        return Promise.resolve(caseNotes);
    }

    public updateCaseNotes(companyName: string, updatedCaseNotes: string): Promise<void> {
        localStorage.setItem(caseNotesKey, updatedCaseNotes);
        return Promise.resolve();
    }
}