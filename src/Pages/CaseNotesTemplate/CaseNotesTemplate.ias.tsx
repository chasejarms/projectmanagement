import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { FormControlState } from '../../Classes/formControlState';

// tslint:disable-next-line:no-empty-interface

export interface ICaseNotesTemplateProps extends RouteComponentProps<any> {}

// tslint:disable-next-line:no-empty-interface
export interface ICaseNotesTemplateState {
    notes: FormControlState<string>;
    caseNotesSaveInProgress: boolean;
    initialLoadInProgress: boolean;
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

    const loadingPageContainer = css({
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    })

    const asyncButtonContainer = css({
        marginTop: 16,
        display: 'flex',
        justifyContent: 'flex-end',
    });

    return {
        caseNotesContainer,
        caseNotesTitle,
        caseNotesPaper,
        caseNotesSubheading,
        caseNotesField,
        loadingPageContainer,
        asyncButtonContainer,
    };
}