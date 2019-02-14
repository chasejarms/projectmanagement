import { css } from 'emotion';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';

// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderProps {}
// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderState {
    prescriptionFormTemplate: IPrescriptionFormTemplate;
}

export const createPrescriptionBuilderClasses = (
    props: IPrescriptionBuilderProps,
    state: IPrescriptionBuilderState,
) => {
    const drawerWidth = 320;

    const drawerPaper = css({
        width: drawerWidth,
    });

    const prescriptionBuilderContainer = css({
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
    });

    const prescriptionFormContainer = css({
        flexGrow: 1,
        margin: 32,
        padding: 32,
        boxSizing: 'border-box',
        overflowY: 'auto',
    })

    const drawerReplacement = css({
        display: 'flex',
        flex: '0 0 320px',
    });

    const sectionsContainer = css({
        display: 'grid',
        gridRowGap: 32,
    })

    return {
        drawerPaper,
        prescriptionBuilderContainer,
        prescriptionFormContainer,
        drawerReplacement,
        sectionsContainer,
    };
}