import { ICompanySelectionApi } from "./companySelectionInterface";

export class MockCompanySelectionApi implements ICompanySelectionApi {
    public getCompaniesForCurrentUser(firebaseAuthenticationUid: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}