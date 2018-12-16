export const requiredValidator = (errorMessage: string) => (value: any): string | null => {
    const valueIsPresent = value !== undefined && value !== '';
    return valueIsPresent ? null : errorMessage;
}