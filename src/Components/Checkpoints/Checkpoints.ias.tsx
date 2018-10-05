import { css } from 'emotion';
import { ICheckpoint } from '../../Models/checkpoint';

// tslint:disable-next-line:no-empty-interface
export interface ICheckpointsProps {
    checkpoints: ICheckpoint[];
    projectCreation: boolean;
}

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
    });

    const nameAndDescription = css({
        display: 'flex',
        flexDirection: 'row',
    });

    const infoIcon = css({
        position: 'relative',
        top: -4,
        marginLeft: 8,
    });

    return {
        fabButton,
        dialogContent,
        dialogControl,
        checkpointsToolbarContainer,
        checkpointRow,
        checkpointsPaper,
        nameAndDescription,
        infoIcon,
    };
}