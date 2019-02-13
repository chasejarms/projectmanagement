import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderProps {}
// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderState {}

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
        boxSizing: 'border-box',
    })

    const drawerReplacement = css({
        display: 'flex',
        flex: '0 0 320px',
    });

    return {
        drawerPaper,
        prescriptionBuilderContainer,
        prescriptionFormContainer,
        drawerReplacement,
    };
}