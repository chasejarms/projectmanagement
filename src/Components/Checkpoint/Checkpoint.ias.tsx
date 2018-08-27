import { css } from 'emotion';
import { ICheckpoint } from '../../Models/checkpoint';

export interface ICheckpointProps {
    checkpoint: ICheckpoint;
}
// tslint:disable-next-line:no-empty-interface
export interface ICheckpointState {}

export const createCheckpointClasses = (
    props: ICheckpointProps,
    state: ICheckpointState,
) => {
    const checkpointContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    });

    const nameAndDescriptionContainer = css({
        flexDirection: 'column',
    });

    const completeContainer = css({
        display: 'flex',
        flexDirection: 'row',
    });

    return {
        checkpointContainer,
        nameAndDescriptionContainer,
        completeContainer,
    };
}