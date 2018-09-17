import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface ICheckpointsProps {}

// tslint:disable-next-line:no-empty-interface
export interface ICheckpointsState {
    open: boolean;
    checkpointName: string;
    checkpointDescription: string;
    checkpointDeadline: string;
    isUpdate: boolean;
    index?: number;
}

export const createCheckpointsClasses = (
    props: ICheckpointsProps,
    state: ICheckpointsState,
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

    const checkpointsToolbarContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    });

    const checkpointRow = css({
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f5f5f5'
        },
    });

    const checkpointsPaper = css({
        overflow: 'hidden',
    })

    return {
        fabButton,
        dialogContent,
        dialogControl,
        checkpointsToolbarContainer,
        checkpointRow,
        checkpointsPaper,
    };
}