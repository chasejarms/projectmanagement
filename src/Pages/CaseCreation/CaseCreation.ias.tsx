import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface ICaseCreationProps {};
// tslint:disable-next-line:no-empty-interface
export interface ICaseCreationState {}

export const createCaseCreationClasses = (
    props: ICaseCreationProps,
    state: ICaseCreationState,
) => {
    const caseCreationContainer = css({
        height: '100vh',
        padding: 32,
        boxSizing: 'border-box',
    });

    return {
        caseCreationContainer,
    };
}