import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { ICaseCreationSliceOfState } from 'src/Redux/Reducers/caseCreationReducer';

export interface ICaseCreationProps extends WithTheme, RouteComponentProps<{}> {
    caseCreationState: ICaseCreationSliceOfState;
};

export interface ICaseCreationState {
    loadingPrescriptionTemplate: boolean;
    prescriptionFormTemplate: IPrescriptionFormTemplate | null;
}

export const createCaseCreationClasses = (
    props: ICaseCreationProps,
    state: ICaseCreationState,
) => {
    const caseCreationContainer = css({
        height: '100vh',
        width: '100%',
        flexDirection: 'row',
        display: 'flex',
    });

    const caseCreationFormContainer = css({
        flexGrow: 1,
        margin: 32,
        padding: 32,
        paddingTop: 32,
        paddingBottom: 32,
        boxSizing: 'border-box',
        overflowY: 'auto',
    });

    const sectionsContainer = css({
        display: 'grid',
    });

    const sectionContainer = css({
        border: '3px solid rgba(0,0,0,0.08)',
        backgroundColor: '#f9f9f9',
        borderRadius: 3,
        '&:hover': {
            cursor: 'pointer',
        },
        minHeight: 120,
        boxSizing: 'border-box',
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 16,
        paddingRight: 16,
        display: 'grid',
        gridRowGap: 16,
    });

    const controlContainer = css({
        border: '3px solid transparent',
    });

    return {
        caseCreationContainer,
        caseCreationFormContainer,
        sectionsContainer,
        sectionContainer,
        controlContainer,
    };
}