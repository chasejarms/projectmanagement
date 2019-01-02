import { css } from 'emotion';
import { RouteComponentProps } from 'react-router'
import { IWorkflowCheckpoint } from '../..//Models/workflow';
import { FormControlState } from '../../Classes/formControlState';
import { IUser } from '../../Models/user';
import { IUserSliceOfState } from '../../Redux/Reducers/userReducer';

export interface IUsersPresentationProps extends RouteComponentProps<{}> {
    userState: IUserSliceOfState;
}

export interface IUsersPresentationState {
    open: boolean;
    userFullName: FormControlState<string>;
    userEmail: FormControlState<string>;
    userRole: string;
    users: IUser[];
    additionalCheckpoints: Set<string>;
    checkpoints: IWorkflowCheckpoint[];
    addingOrUpdatingUser: boolean;
    deletingUser: boolean;
    isUpdate: boolean;
    idOfUserBeingUpdated: string;
}

export const createUsersPresentationClasses = (
    props: IUsersPresentationProps,
    state: IUsersPresentationState,
) => {
    const fabButton = css({
        position: 'absolute',
        bottom: 16,
        right: 16,
    });

    const dialogContent = css({
        display: 'flex',
        flexDirection: 'column',
    });

    const dialogControl = css({
        width: 550,
        marginBottom: 16,
    });

    const usersContainer = css({
        height: '100vh',
        padding: 32,
        boxSizing: 'border-box',
    });

    const usersToolbarContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    });

    const userRow = css({
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f5f5f5'
        },
    });

    const usersPaper = css({
        overflow: 'hidden',
    });

    const clearCheckpointIcon = css({
        cursor: 'pointer',
    });

    const addedItemContainer = css({
        paddingLeft: 8,
        height: 32,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    });

    const automaticScanCheckpointsContainer = css({
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 16,
    });

    const potentialCheckpointsContainer = css({
        width: 'calc(50% - 8px)',
        marginRight: 16,
        display: 'inline-block',
    });

    const potentialCheckpointsSelect = css({
        width: '100%',
    });

    const automaticScanCheckpoints = css({
        marginTop: 24,
        width: 'calc(50% - 8px)',
        display: 'inline-block',
    });

    const dialogActionButtons = css({
        display: 'flex',
        justifyContent: 'space-between',
    });

    return {
        fabButton,
        dialogContent,
        dialogControl,
        usersContainer,
        usersToolbarContainer,
        userRow,
        usersPaper,
        clearCheckpointIcon,
        addedItemContainer,
        automaticScanCheckpointsContainer,
        potentialCheckpointsContainer,
        potentialCheckpointsSelect,
        automaticScanCheckpoints,
        dialogActionButtons,
    };
}