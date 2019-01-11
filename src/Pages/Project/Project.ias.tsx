import { Theme, WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { FormControlState } from 'src/Classes/formControlState';
import { IAttachmentMetadata } from 'src/Models/attachmentMetadata';
import { ICheckpoint } from 'src/Models/checkpoint';
// import { ICase } from '../../Models/case';

// tslint:disable-next-line:no-empty-interface
export interface IProjectPresentationProps extends RouteComponentProps<{}>, WithTheme {}

export interface IProjectPresentationState {
    caseName: FormControlState<string>;
    caseDeadline: FormControlState<Date>;
    notes: FormControlState<string>;
    projectInformationIsLoading: boolean;
    attachmentUrls: IAttachmentMetadata[];
    checkpoints: ICheckpoint[] | null;
    open: boolean;
    caseId: string;
    updateCaseInformationInProgress: boolean;
    addAttachmentInProgress: boolean;
    filePath: string;
    dialogIsOpen: boolean;
    dialogError: string;
    srcUrls: string[];
    indexOfHoveredItem: null | number;
}

export const createProjectPresentationClasses = (
    props: IProjectPresentationProps,
    state: IProjectPresentationState,
    theme: Theme,
) => {
    const attachmentsContainer = css({
        width: '100%',
        boxSizing: 'border-box',
        paddingLeft: 32,
        paddingRight: 32,
        paddingBottom: 32,
    });

    const progressAndInformationContainer = css({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridColumnGap: 32,
        width: '100%',
        height: '100vh',
        padding: 32,
        boxSizing: 'border-box',
    });

    const projectContainer = css({
        height: '100vh',
        overflowY: 'auto',
    })

    const evenPaper = css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        padding: 16,
        paddingTop: 0,
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
        justifyContent: 'space-between',
    });

    const secondPaper = css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
    });

    const tabs = css({
        flexBasis: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    })

    const tabsContentContainer = css({
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    });

    const fieldSpacing = css({
        marginBottom: 16,
        flexGrow: 1,
    });

    const selectedTab = css({
        color: theme.palette.primary.main,
    })

    const nonSelectedTab = css({
        color: 'white',
    });

    const attachmentButtonsContainer = css({
        padding: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    });

    const seeAttachmentsButton = css({
        marginRight: 8,
    });

    const workflowToolbar = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    });

    const attachmentToolbar = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 16,
        paddingLeft: 16,
    })

    const qrCodeButtonContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    });

    const addAttachmentButton = css({
        position: 'relative',
        overflow: 'hidden',
    });

    const addAttachmentInput = css({
        position: 'absolute',
        width: '100%',
        height: '100%',
        paddingTop: 100,
    });

    const qrCodeButton = css({
        marginLeft: 8,
    });

    const caseInformationToolbar = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0,
    });

    const imgContainer = css({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridGap: 16,
        gridRow: '1/1',
        gridColumn: '1/1',
        '&::before': {
            content: '""',
            width: 0,
            paddingBottom: '100%',
            gridRow: '1/1',
            gridColumn: '1/1',
            height: 0,
        },
        '& > *:first-child': {
            gridRow: '1/1',
            gridColumn: '1/1',
        },
        padding: 16,
    });

    const cancelIconContainer = css({
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 8,
        '&:hover': {
            cursor: 'pointer',
        }
    });

    const downloadIconContainer = css({
        position: 'absolute',
        top: 0,
        right: 53,
        padding: 8,
        '&:hover': {
            cursor: 'pointer',
        }
    });

    const imagePaper = css({
        overflow: 'hidden',
        position: 'relative',
    });

    const iconContainer = css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        position: 'relative',
    })

    const documentIcon = css({
        fontSize: '4em',
    })

    const documentFilePathContainer = css({
        position: 'absolute',
        width: '100%',
        display: 'block',
        textOverflow: 'ellipsis',
        height: 50,
        backgroundColor: 'black',
        opacity: .5,
        bottom: 0,
        paddingLeft: 8,
        paddingRight: 8,
        boxSizing: 'border-box',
    });

    const documentFilePath = css({
        width: '100%',
        display: 'block',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        color: 'white',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        paddingTop: 14,
    });

    const img = css({
        width: '100%',
    });

    const cancelIcon = css({
        fontSize: 32,
    });

    const downloadIcon = css({
        fontSize: 32,
    })

    return {
        downloadIcon,
        attachmentToolbar,
        projectContainer,
        tabs,
        tabsContentContainer,
        selectedTab,
        nonSelectedTab,
        evenPaper,
        secondPaper,
        fieldSpacing,
        attachmentButtonsContainer,
        seeAttachmentsButton,
        workflowToolbar,
        qrCodeButtonContainer,
        addAttachmentButton,
        addAttachmentInput,
        qrCodeButton,
        caseInformationToolbar,
        progressAndInformationContainer,
        attachmentsContainer,
        imgContainer,
        imagePaper,
        cancelIconContainer,
        iconContainer,
        documentIcon,
        documentFilePathContainer,
        documentFilePath,
        img,
        cancelIcon,
        downloadIconContainer,
    };
}