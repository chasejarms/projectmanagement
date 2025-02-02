import { css } from 'emotion';
import { RouteComponentProps } from 'react-router'
import { IUser } from '../../Models/user';

// tslint:disable-next-line:no-empty-interface
export interface IUsersPresentationProps extends RouteComponentProps<{}> {}

// tslint:disable-next-line:no-empty-interface
export interface IUsersPresentationState {
    open: boolean;
    newUserFullName: string;
    newUserEmail: string;
    newUserRole: string;
    users: IUser[];
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
        width: 400,
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

    return {
        fabButton,
        dialogContent,
        dialogControl,
        usersContainer,
        usersToolbarContainer,
        userRow,
        usersPaper,
    };
}