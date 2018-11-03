import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface ICaseNotesTemplateProps {}

// tslint:disable-next-line:no-empty-interface
export interface ICaseNotesTemplateState {
    notes: string;
}

export const createCaseNotesTemplateClasses = (
    props: ICaseNotesTemplateProps,
    state: ICaseNotesTemplateState,
) => {
    const caseNotesContainer = css({
        height: '100vh',
        padding: 32,
        boxSizing: 'border-box',
    });

    const caseNotesTitle = css({
        paddingBottom: 32,
    });

    const caseNotesPaper = css({
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
    });

    const caseNotesSubheading = css({
        paddingBottom: 32,
    });

    const caseNotesField = css({
        width: '100%',
    });

    return {
        caseNotesContainer,
        caseNotesTitle,
        caseNotesPaper,
        caseNotesSubheading,
        caseNotesField,
    };
}