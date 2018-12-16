export const companyNameValidator = (companyName: string): string | null => {
    const nameIsAllLowercase = companyName === companyName.toLowerCase();
    if (!nameIsAllLowercase) {
        return 'No capital letters are allowed';
    }

    const lettersAndUnderscoresRegex = /^[a-z_]+$/
    const nameHasLettersAndUnderscores = lettersAndUnderscoresRegex.test(companyName);
    if (!nameHasLettersAndUnderscores) {
        return 'Only letters and underscores are allowed';
    }

    return null;
}