export interface IBaseUser {
    companyId: string;
    email: string;
    name: string;
    id: string;
    authUserId: string;
    /**
     * Indicates whether or not a user is active for a given company. Deleting a user
     * actually flips this flag under the hood, keeping the user's document in the
     * database alive. This is important as this user may be tied to checkpoints on
     * archived cases.
     */
    isActive: boolean;
}