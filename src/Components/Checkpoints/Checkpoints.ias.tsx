import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface ICheckpointsProps {}

// tslint:disable-next-line:no-empty-interface
export interface ICheckpointsState {
    open: boolean;
    checkpointName: string;
    checkpointDescription: string;
    checkpointDeadline: Date;
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

    return {
        fabButton,
        dialogContent,
        dialogControl,
    };
}