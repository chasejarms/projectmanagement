import { Collections } from 'src/Models/collections';
import { db } from '../../firebase';
import { ICompanySelectionApi } from './companySelectionInterface';

export class CompanySelectionApi implements ICompanySelectionApi {
    public getCompaniesForCurrentUser(authUserId: string): Promise<firebase.firestore.QuerySnapshot> {
        return db.collection(Collections.CompanyAuthUserJoin)
            .where('authUserId', '==', authUserId)
            .get();
    }
}