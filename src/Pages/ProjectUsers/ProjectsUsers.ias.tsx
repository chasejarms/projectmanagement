import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface IProjectUsersProps {}
// tslint:disable-next-line:no-empty-interface
export interface IProjectUsersState {
    open: boolean;
    user: string;
    checkpointStatus: string;
    additionalCheckpoints: Set<string>,
}

export const createProjectUsersClasses = (
    props: IProjectUsersProps,
    state: IProjectUsersState,
) => {
    const paper = css({
        marginBottom: 32,
        overflow: 'hidden',
    });

    const projectUsersToolbarContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    });

    const dialogControl = css({
        marginBottom: 16,
        minWidth: 500,
    });

    const usersContainer = css({
        padding: 32,
    });

    const dialogContent = css({
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
    });

    const addedUserRow = css({
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f5f5f5'
        },
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
    });

    const selectControl = css({
        width: '100%',
    });

    const dialogRowSecondItem = css({
        marginTop: 24,
        width: 'calc(50% - 8px)',
        display: 'inline-block',
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

    return {
        paper,
        projectUsersToolbarContainer,
        dialogControl,
        usersContainer,
        dialogContent,
        addedUserRow,
        dialogRow,
        dialogRowFirstItem,
        selectControl,
        dialogRowSecondItem,
        addedItemContainer,
        clearCheckpointIcon,
    };
}