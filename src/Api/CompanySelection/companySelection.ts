import { db } from '../../firebase';
import { ICompanySelectionApi } from './companySelectionInterface';

export class CompanySelectionApi implements ICompanySelectionApi {
    public getCompaniesForCurrentUser(firebaseAuthenticationUid: string): Promise<firebase.firestore.QuerySnapshot> {
        return db.collection('companyUserJoin')
            .where('firebaseAuthenticationUid', '==', firebaseAuthenticationUid)
            .get();
    }
}