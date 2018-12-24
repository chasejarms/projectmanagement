export interface ICompanySelectionApi {
    getCompaniesForCurrentUser(firebaseAuthenticationUid: string): Promise<firebase.firestore.QuerySnapshot>;
}