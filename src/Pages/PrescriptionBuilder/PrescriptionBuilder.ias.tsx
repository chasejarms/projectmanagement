import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { IPrescriptionBuilderSliceOfState } from 'src/Redux/Reducers/prescriptionBuilderReducer';

// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderProps extends WithTheme, RouteComponentProps<{}> {
    prescriptionBuilderState: IPrescriptionBuilderSliceOfState;
    setPrescriptionFormTemplate: (prescriptionFormTemplate: IPrescriptionFormTemplate) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderState {
    prescriptionFormTemplate: IPrescriptionFormTemplate;
    selectedSection: string | null;
    selectedControl: string | null;
    controlValues: {
        [controlId: string]: any,
    };
    updatingPrescriptionTemplate: boolean;
    loadingPrescriptionTemplate: boolean;
    snackbarIsOpen: boolean;
    updatingPrescriptionTemplateSuccess: boolean;
}

export const createPrescriptionBuilderClasses = (
    props: IPrescriptionBuilderProps,
    state: IPrescriptionBuilderState,
) => {
    const paddingFromSectionCount = state.prescriptionFormTemplate.sectionOrder.length > 0 ? 0 : 32;

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
        paddingTop: paddingFromSectionCount,
        paddingBottom: paddingFromSectionCount,
        boxSizing: 'border-box',
        overflowY: 'auto',
    })

    const drawerReplacement = css({
        display: 'flex',
        flex: '0 0 320px',
    });

    const sectionsContainer = css({
        display: 'grid',
    })

    const sectionContainer = css({
        border: '3px solid rgba(0,0,0,0.08)',
        backgroundColor: '#f9f9f9',
        borderRadius: 3,
        '&:hover': {
            cursor: 'pointer',
        },
        minHeight: 120,
        boxSizing: 'border-box',
    });

    const innerDrawerContainer = css({
        padding: 16,
        boxSizing: 'border-box',
        height: '100%',
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
        width: '100%',
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
        position: 'relative',
        marginRight: 16,
        marginLeft: 16,
    });

    const controlsContainer = css({
        display: 'grid',
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
        marginLeft: 8,
        position: 'relative',
        top: 19,
        '&:hover': {
            cursor: 'pointer',
        }
    })

    const addOptionButtonContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    });

    const drawerSplitSections = css({
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: '100%',
    });

    const cityStateZipContainer = css({
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridColumnGap: 16,
    });

    const darkGrey = css({
        color: '#9e9e9e',
    });

    const formElementDropZoneClass = css({
        position: 'absolute',
        width: '100%',
        zIndex: 1,
    });

    const noFieldsContainer = css({
        marginRight: 16,
        marginLeft: 16,
        width: '100%',
    });

    const selectedControlContainerClass = css({
        background: 'white',
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2)',
        padding: 16,
        borderRadius: 3,
    });

    const fieldPaletteClass = css({
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 16,
    });

    const hrClass = css({
        borderColor: props.theme.palette.grey[100],
        backgroundColor: props.theme.palette.grey[100],
        marginTop: 16,
    });

    const threeColumns = css({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridGap: 16,
    });

    const inputAndTrashContainer = css({
        display: 'flex',
        flexDirection: 'row',
    });

    const editControlContainer = css({
        marginBottom: 16,
    });

    const prescriptionFormInnerContainer = css({
        position: 'relative',
    });

    const dragIconContainerClass = css({
        display: 'flex',
        justifyContent: 'flex-end',
    });

    const topMarginPrescriptionTemplateContainer = state.prescriptionFormTemplate.sectionOrder.length > 0 ? 0 : 32;
    const bottomMarginPrescriptionTemplateContainer = state.prescriptionFormTemplate.sectionOrder.length === 0 ? 0 : 32;


    const savePrescriptionTemplateContainer = css({
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: topMarginPrescriptionTemplateContainer,
        marginTop: bottomMarginPrescriptionTemplateContainer,
    })

    const circularProgressContainer = css({
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    });

    return {
        prescriptionBuilderContainer,
        prescriptionFormContainer,
        drawerReplacement,
        sectionContainer,
        sectionsContainer,
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
        drawerSplitSections,
        cityStateZipContainer,
        darkGrey,
        formElementDropZoneClass,
        noFieldsContainer,
        selectedControlContainerClass,
        fieldPaletteClass,
        hrClass,
        threeColumns,
        inputAndTrashContainer,
        editControlContainer,
        prescriptionFormInnerContainer,
        dragIconContainerClass,
        savePrescriptionTemplateContainer,
        circularProgressContainer,
    };
}