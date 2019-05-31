import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { IProjectCreationSliceOfState } from 'src/Redux/Reducers/caseCreationReducer';

export interface IProjectCreationProps extends WithTheme, RouteComponentProps<{}> {
    caseCreationState: IProjectCreationSliceOfState;
    clearCaseCreationState: () => void;
};

export interface IProjectCreationState {
    loadingPrescriptionTemplate: boolean;
    prescriptionFormTemplate: IPrescriptionFormTemplate | null;
    caseCreationInProgress: boolean;
    canCreateCases: boolean;
    companyLogoDownloadURL?: string;
    projectId: string;
}

export const createCaseCreationClasses = (
    props: IProjectCreationProps,
    state: IProjectCreationState,
) => {
    let companyLogoImage: string = '';

    if (!!state.companyLogoDownloadURL) {
        companyLogoImage = css({
            maxWidth: 400,
            maxHeight: 100,
            display: 'block',
            width: 'auto',
            height: 'auto',
        });
    }

    const caseCreationContainer = css({
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 32,
        boxSizing: 'border-box',
    });

    const caseCreationFormContainer = css({
        flexGrow: 1,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    });

    const sectionsContainer = css({
        display: 'grid',
        gridRowGap: 32,
        flexGrow: 1,
        overflowY: 'auto',
        padding: 32,
        boxSizing: 'border-box',
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

    const circularProgressContainer = css({
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
    });

    const createCaseButtonContainer = css({
        display: 'flex',
        justifyContent: 'flex-end',
        flex: '0 0 auto',
        padding: 8,
        borderTop: '1px solid rgba(224, 224, 224, 1)',
    });

    const cannotCreateCaseContainer = css({
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    })

    return {
        caseCreationContainer,
        caseCreationFormContainer,
        sectionsContainer,
        sectionContainer,
        controlContainer,
        circularProgressContainer,
        createCaseButtonContainer,
        cannotCreateCaseContainer,
        companyLogoImage,
    };
}