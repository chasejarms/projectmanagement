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

    return {
        fabButton,
        dialogContent,
        dialogControl,
    };
}