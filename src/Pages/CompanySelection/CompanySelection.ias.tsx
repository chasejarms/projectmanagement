import { css } from 'emotion';
import * as firebase from 'firebase';
import { RouteComponentProps } from 'react-router';

// tslint:disable-next-line:no-empty-interface
export interface ICompanySelectionPresentationProps extends RouteComponentProps<any> {}

// tslint:disable-next-line:no-empty-interface
export interface ICompanySelectionPresentationState {
    loadingCompanies: boolean;
    companiesQuerySnapshot: firebase.firestore.QuerySnapshot | null;
}

export const createCompanySelectionPresentationClasses = (
    props: ICompanySelectionPresentationProps,
    state: ICompanySelectionPresentationState,
) => {
    const pageContainer = css({
        minHeight: '100vh',
        minWidth: '100vw',
    })

    return {
        pageContainer,
    };
}