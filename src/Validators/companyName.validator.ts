export const companyNameValidator = (companyName: string): string | null => {
    const charactersAndSpacesRegex = /^[a-zA-Z ]+$/
    const nameIsOnlyCharactersAndSpaces = charactersAndSpacesRegex.test(companyName);
    if (!nameIsOnlyCharactersAndSpaces) {
        return 'Only letters and spaces are allowed';
    }

    return null;
}