export interface ICompanySelectionApi {
    getCompaniesForCurrentUser(authUserId: string): Promise<firebase.firestore.QuerySnapshot>;
}