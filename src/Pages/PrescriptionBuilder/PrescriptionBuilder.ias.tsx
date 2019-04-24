import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';
import { IPrescriptionBuilderSliceOfState } from 'src/Redux/Reducers/prescriptionBuilderReducer';

export interface IPrescriptionBuilderProps extends WithTheme, RouteComponentProps<{}> {
    prescriptionBuilderState: IPrescriptionBuilderSliceOfState;
    setPrescriptionFormTemplate: (prescriptionFormTemplate: IPrescriptionFormTemplate) => void;
    addNewSectionTemplate: (item: any, insertPosition: number) => void;
    onDropExistingSection: (item: any, insertPosition: number) => void;
    onDropNewControl: (sectionId: string, item: any, insertPosition: number) => void;
    onDropExistingControl: (targetSectionId: string, insertPosition: number, item: any) => void;
    removeControl: () => void;
    removeSection: () => void;
    setSelectedControl: (controlId: string | null) => void;
    setSelectedSection: (sectionId: string | null) => void;
    updateControlValue: (controlId: string, value: any) => void;
    setCompanyLogoURL: (companyURL: string) => void;
}

export interface IPrescriptionBuilderState {
    updatingPrescriptionTemplate: boolean;
    loadingPrescriptionTemplate: boolean;
    uploadingCompanyLogoURL: boolean;
    snackbarIsOpen: boolean;
    updatingPrescriptionTemplateSuccess: boolean;
    dialogIsOpen: boolean;
    dialogError: string;
    companyLogoDownloadURL?: string;
}

export const createPrescriptionBuilderClasses = (
    props: IPrescriptionBuilderProps,
    state: IPrescriptionBuilderState,
) => {
    const paddingFromSectionCount = props.prescriptionBuilderState.prescriptionFormTemplate.sectionOrder.length > 0 ? 0 : 32;

    const prescriptionBuilderContainer = css({
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
    });

    const prescriptionFormContainer = css({
        flexGrow: 1,
        margin: 32,
        paddingTop: paddingFromSectionCount,
        paddingBottom: paddingFromSectionCount,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
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
        paddingLeft: 32,
        paddingRight: 32,
        overflowY: 'auto',
        flexGrow: 1,
    });

    const dragIconContainerClass = css({
        display: 'flex',
        justifyContent: 'flex-end',
    });

    const savePrescriptionTemplateContainer = css({
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        flex: '0 0 auto',
        padding: 8,
        boxSizing: 'border-box',
        borderTop: '1px solid rgba(224, 224, 224, 1)',
    })

    const circularProgressContainer = css({
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    });

    const logoAndImageContainer = css({
        marginTop: 32,
    });

    const addAttachmentInput = css({
        position: 'absolute',
        width: '100%',
        height: '100%',
        paddingTop: 100,
    });

    const addLogoButton = css({
        position: 'relative',
        overflow: 'hidden',
    });

    let companyLogoImage: string = '';

    if (!!state.companyLogoDownloadURL) {
        companyLogoImage = css({
            maxWidth: 400,
            maxHeight: 200,
            backgroundImage: `url(${state.companyLogoDownloadURL})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            height: 100,
        })
    }

    return {
        logoAndImageContainer,
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
        addAttachmentInput,
        addLogoButton,
        companyLogoImage,
    };
}