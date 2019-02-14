import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IAttachmentMetadata } from 'src/Models/attachmentMetadata';
import { FormControlState } from '../../Classes/formControlState';
import { IProjectCreationProjectUser } from '../../Models/projectUser';
import { ISlimDoctor } from '../../Models/slimDoctor';
import { IUser } from '../../Models/user';
import { IWorkflowCheckpoint } from '../../Models/workflow';
import { IProjectCreationSliceOfState } from '../../Redux/Reducers/projectCreationReducer';
import { IUserSliceOfState } from '../../Redux/Reducers/userReducer';

// tslint:disable-next-line:no-empty-interface
export interface IProjectCreationProps extends WithTheme, RouteComponentProps<{}> {
    projectCreation: IProjectCreationSliceOfState;
    resetProjectCreation: () => void;
    updateCaseName: (caseNameControl: FormControlState<string>) => void;
    getInitialProjectCreationCheckpoints: (companyName: string) => void;
    addProjectUser: (projectUser: IProjectCreationProjectUser) => void;
    updateProjectUser: (projectUser: IProjectCreationProjectUser, index: number) => void;
    deleteProjectUser: (index: number) => void;
    userState: IUserSliceOfState;
}
// tslint:disable-next-line:no-empty-interface
export interface IProjectCreationState {
    activeStep: number;
    checkpoints: IWorkflowCheckpoint[];
    open: boolean;
    user: IUser;
    userName: string;
    checkpointStatus: any;
    role: any;
    additionalCheckpoints: Set<string>;
    isUpdate: boolean;
    index: number;
    popperIsOpen: boolean;
    caseDeadline: FormControlState<Date>;
    projectNotes: string;
    doctorSelection: FormControlState<ISlimDoctor>;
    doctorNameSearch: string;
    potentialDoctors: IUser[];
    createProjectInProgress: boolean;
    attachmentUrls: IAttachmentMetadata[];
    srcUrls: string[];
    uniqueCaseId: string;
    uploadingAttachmentInProgress: boolean;
    filePath: string | string[];
    dialogError: string;
    dialogIsOpen: boolean;
}

export const createProjectCreationClasses = (
    props: IProjectCreationProps,
    state: IProjectCreationState,
) => {
    const projectCreationContainer = css({
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    });

    const stepperContent = css({
        flexGrow: 1,
        overflowY: 'auto',
        // backgroundColor: '#fefefe'
    });

    const stepperContainer = css({
        flexGrow: 1,
    });

    const actionButtonContainer = css({
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        flexBasis: 300,
    });

    const baseActionButton = css({
        marginLeft: 16,
        paddingLeft: 24,
        paddingRight: 24,
    });

    const asyncActionButton = css({
        marginLeft: 16,
    });

    const projectNameContainer = css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });

    const projectName = css({
        width: 400,
        margin: 16,
    });

    const caseDeadline = css({
        width: 400,
        margin: 16,
    });

    const multipleCheckpointsContainer = css({
        paddingTop: 48,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
    });

    const singleCheckpointContainer = css({
        marginBottom: 48,
        marginRight: 48,
        marginLeft: 48,
    });

    const topBar = css({
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 0,
        width: '100%',
    });
    
    const topBarContainer = css({
        paddingTop: 32,
        paddingLeft: 32,
        paddingRight: 32,
    });

    const paper = css({
        marginBottom: 32,
        overflow: 'hidden',
    });

    const autocompletePaper = css({
        zIndex: 1,
        position: 'relative',
        top: 35,
        overflow: 'visible',
    })

    const usersContainer = css({
        padding: 32,
    });

    const addedUserRow = css({
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f5f5f5'
        },
    })

    const fabButton = css({
        position: 'absolute',
        bottom: 16,
        right: 16,
    });

    const dialogControl = css({
        marginBottom: 16,
        minWidth: 500,
    });

    const dialogContent = css({
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
    });

    const dialogRow = css({
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 16,
    });

    const dialogRowFirstItem = css({
        width: 'calc(50% - 8px)',
        marginRight: 16,
        display: 'inline-block',
    })

    const dialogRowSecondItem = css({
        marginTop: 24,
        width: 'calc(50% - 8px)',
        display: 'inline-block',
    });

    const selectControl = css({
        width: '100%',
    });

    const addedItemContainer = css({
        paddingLeft: 8,
        height: 32,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    });

    const clearCheckpointIcon = css({
        cursor: 'pointer',
    });

    const checkpointContainer = css({
        padding: 32,
    });

    const projectUsersToolbarContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    });

    const fullWidthPaper = css({
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
    });

    const underline = css({
        // // '&:focus': {
        // //     borderColor: props.theme.palette.secondary.main,
        // // },
        // '&::after': {
        //     borderColor: props.theme.palette.secondary.main,
        // },

        // '&::before': {
        //     borderColor: 'white',
        // }
        '&::before': {
            borderColor: 'white !important',
        },
        '&::after': {
            borderColor: props.theme.palette.secondary.main,
        }
    });

    const root = css({
        color: 'white',
        'div > label + &': {
            color: 'white',
        }
        // 'label': {
        //     color: 'white',
        // }
    });

    const focused = css({
        color: `${props.theme.palette.secondary.main} !important`,
    })

    const myRefSpacing = css({
        height: 50,
    });

    const paperInPopper = css({
        position: 'relative',
        top: 81,
        overflowY: 'visible',
    });

    const userDialogContainer = css({
        overflowY: 'visible',
    });

    const projectNotesContainer = css({
        display: 'flex',
        margin: 16,
    });

    const projectNotesInput = css({
        flexGrow: 1,
    });

    const addAttachmentButtonContainer = css({
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 16,
        marginTop: 32,
    });

    const rootCaseDeadlineClass = css({
        
    });

    const caseDoctorContainer = css({
        flexDirection: 'row',
    })

    const potentialDoctorPaper = css({
        marginLeft: 16,
        position: 'relative',
    });

    const menuPopover = css({
        position: 'absolute',
        width: 432,
        marginTop: 16,
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

    const doctorContainer = css({
        display: 'flex',
        flexDirection: 'column',
    });

    const imgContainer = css({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridGap: 16,
        margin: 16,
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
        }
    });

    const img = css({
        width: '100%',
    });

    const cancelIcon = css({
        fontSize: 32,
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

    const imagePaper = css({
        overflow: 'hidden',
        position: 'relative',
        [`&:hover ${cancelIconContainer}`]: {
            display: 'block',
        }
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

    const doctorTitle = css({
        marginRight: 8,
    });

    const doctorEmailSubtitle = css({
        overflow: 'ellipsis',
    });

    return {
        projectCreationContainer,
        stepperContainer,
        stepperContent,
        actionButtonContainer,
        baseActionButton,
        projectNameContainer,
        projectName,
        rootCaseDeadlineClass,
        caseDeadline,
        multipleCheckpointsContainer,
        singleCheckpointContainer,
        topBar,
        paper,
        usersContainer,
        addedUserRow,
        fabButton,
        dialogControl,
        dialogContent,
        dialogRow,
        dialogRowFirstItem,
        dialogRowSecondItem,
        selectControl,
        addedItemContainer,
        clearCheckpointIcon,
        checkpointContainer,
        projectUsersToolbarContainer,
        topBarContainer,
        fullWidthPaper,
        underline,
        root,
        focused,
        autocompletePaper,
        myRefSpacing,
        paperInPopper,
        userDialogContainer,
        projectNotesContainer,
        projectNotesInput,
        addAttachmentButtonContainer,
        caseDoctorContainer,
        potentialDoctorPaper,
        menuPopover,
        asyncActionButton,
        addAttachmentButton,
        addAttachmentInput,
        imgContainer,
        img,
        imagePaper,
        iconContainer,
        documentIcon,
        documentFilePath,
        documentFilePathContainer,
        cancelIconContainer,
        cancelIcon,
        doctorContainer,
        doctorTitle,
        doctorEmailSubtitle,
    };
}