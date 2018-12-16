export const passwordValidator = (password: string): string | null => {
    return password.length > 6 ? null : 'The password must be more than 6 characters';
}