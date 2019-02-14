import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';

// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderProps extends WithTheme {}
// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderState {
    prescriptionFormTemplate: IPrescriptionFormTemplate;
    hoveredSection: string | null;
    hoveredControl: string | null;
    selectedSection: string | null;
    selectedControl: string | null;
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
        padding: 21,
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
        border: '3px solid transparent',
        padding: 8,
        borderRadius: 3,
        '&:hover': {
            cursor: 'pointer',
        }
    })

    const hoverArea = css({
        borderColor: `${props.theme.palette.primary.main}`
    });

    const innerDrawerContainer = css({
        padding: 16,
    });

    const drawerVerticalSpacing = css({
        display: 'grid',
        gridRowGap: 16,
    });

    const addSectionOrFieldContainer = css({
        display: 'grid',
        gridRowGap: 8,
    });

    const buttonLeftMargin = css({
        marginLeft: 8,
    });

    return {
        drawerPaper,
        prescriptionBuilderContainer,
        prescriptionFormContainer,
        drawerReplacement,
        sectionsContainer,
        hoverArea,
        innerDrawerContainer,
        drawerVerticalSpacing,
        addSectionOrFieldContainer,
        buttonLeftMargin,
    };
}