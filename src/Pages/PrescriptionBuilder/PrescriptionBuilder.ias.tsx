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

    const sectionContainer = css({
        border: '3px solid rgba(0,0,0,0.08)',
        backgroundColor: 'rgba(0,0,0,0.08)',
        padding: 16,
        borderRadius: 3,
        '&:hover': {
            cursor: 'pointer',
        },
        minHeight: 120,
        boxSizing: 'border-box',
    });

    const hoverArea = css({
        borderColor: `${props.theme.palette.primary.main} !important`
    });

    const innerDrawerContainer = css({
        padding: 16,
        boxSizing: 'border-box',
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

    const noSectionsInfoText = css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    });

    const noSectionInnerContainer = css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    });

    const noControlForSectionClass = css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    });

    const drawerNoSelectedSectionOrControl = css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    });

    const duplicateSectionButtonContainer = css({
        marginTop: 8,
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
    });

    const controlContainer = css({
        border: '3px solid transparent',
        borderRadius: 3,
        padding: 8,
    });

    const controlsContainer = css({
        display: 'grid',
        gridRowGap: 16,
    })

    const fullWidthClass = css({
        width: '100%',
    });

    const optionsContainer = css({
        display: 'grid',
        gridRowGap: 8,
    });

    const sixteenPixelSpacing = css({
        display: 'grid',
        gridRowGap: 16,
    });

    const optionAndTrashContainer = css({
        display: 'flex',
        flexDirection: 'row',
    });

    const optionName = css({
        flex: '1 0',
    });

    const trashIcon = css({
        flex: '0 0 auto',
        position: 'relative',
        top: 19,
        marginLeft: 8,
        cursor: 'pointer',
    })

    const addOptionButtonContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    });

    return {
        drawerPaper,
        prescriptionBuilderContainer,
        prescriptionFormContainer,
        drawerReplacement,
        sectionContainer,
        sectionsContainer,
        hoverArea,
        innerDrawerContainer,
        drawerVerticalSpacing,
        addSectionOrFieldContainer,
        buttonLeftMargin,
        noSectionsInfoText,
        noSectionInnerContainer,
        noControlForSectionClass,
        drawerNoSelectedSectionOrControl,
        duplicateSectionButtonContainer,
        controlContainer,
        controlsContainer,
        fullWidthClass,
        optionsContainer,
        sixteenPixelSpacing,
        optionAndTrashContainer,
        optionName,
        trashIcon,
        addOptionButtonContainer,
    };
}