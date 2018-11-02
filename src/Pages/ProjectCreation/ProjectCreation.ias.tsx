import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IProjectCreationProjectUser } from '../../Models/projectUser';
import { IUser } from '../../Models/user';
import { IWorkflowCheckpoint } from '../../Models/workflow';
import { IProjectCreationSliceOfState } from '../../Redux/Reducers/projectCreationReducer';

// tslint:disable-next-line:no-empty-interface
export interface IProjectCreationProps extends WithTheme, RouteComponentProps<{}> {
    projectCreation: IProjectCreationSliceOfState;
    updateProjectName: (projectName: string) => void;
    getInitialProjectCreationCheckpoints: () => void;
    addProjectUser: (projectUser: IProjectCreationProjectUser) => void;
    updateProjectUser: (projectUser: IProjectCreationProjectUser, index: number) => void;
    deleteProjectUser: (index: number) => void;
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
    caseDeadline: Date;
    projectNotes: string;
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

    const projectNameContainer = css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });

    const projectName = css({
        width: 400,
        // '& > label': {
        //     color: 'white',
        // },
        // '& > label:focused': {
        //     color: props.theme.palette.primary.main,
        // },
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

    return {
        projectCreationContainer,
        stepperContainer,
        stepperContent,
        actionButtonContainer,
        baseActionButton,
        projectNameContainer,
        projectName,
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
    };
}