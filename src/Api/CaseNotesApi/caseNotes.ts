import { db } from './../../firebase';
import { ICaseNotesApi } from './caseNotesInterface';

export class CaseNotesApi implements ICaseNotesApi {
    public async getCaseNotes(companyName: string): Promise<string> {
        let companyDocumentSnapshot: firebase.firestore.DocumentSnapshot;
        try {
            companyDocumentSnapshot = await db.collection('companies')
                .doc(companyName)
                .get();
        } catch (error) {
            return Promise.resolve(error.message);
        }

        const caseNotes = companyDocumentSnapshot.data()!.caseNotesTemplate;

        return caseNotes || '';
    }

    public async updateCaseNotes(companyName: string, updatedCaseNotes: string): Promise<void> {
        await db.collection('companies')
            .doc(companyName)
            .update({
                caseNotesTemplate: updatedCaseNotes,
            });
    }
}