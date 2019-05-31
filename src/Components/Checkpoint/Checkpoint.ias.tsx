import { css } from 'emotion';
import { IProjectCheckpoint } from 'src/Models/caseCheckpoint';

export interface ICheckpointProps {
    checkpoint: IProjectCheckpoint;
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
        justifyContent: 'start',
        maxWidth: 800,
    });

    const nameAndDescriptionContainer = css({
        display: 'flex',
        flexDirection: 'row',
        paddingRight: 32,
        position: 'relative',
        top: 17,
        flexGrow: 1,
        textOverflow: 'ellipsis',
    });

    const completeContainer = css({
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        top: 10,
    });

    const completeText = css({
        marginTop: 12,
        paddingLeft: 32,
    })

    const descriptionTooltip = css({
        marginRight: 8,
    })

    return {
        checkpointContainer,
        nameAndDescriptionContainer,
        completeContainer,
        completeText,
        descriptionTooltip,
    };
}