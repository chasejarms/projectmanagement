import Checkbox from '@material-ui/core/Checkbox'
// import { TextFieldProps } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { createCheckpointClasses, ICheckpointProps, ICheckpointState } from './Checkpoint.ias';

export class Checkpoint extends React.Component<ICheckpointProps, ICheckpointState> {
    public render() {
        const {
            name,
            complete,
        } = this.props.checkpoint;

        const {
            checkpointContainer,
            nameAndDescriptionContainer,
            completeContainer,
            completeText,
            descriptionTooltip,
        } = createCheckpointClasses(this.props, this.state);

        return (
            <div className={checkpointContainer}>
                <div className={nameAndDescriptionContainer}>
                    <Typography variant="title" className={descriptionTooltip}>{name}</Typography>
                </div>
                <Typography>something</Typography>
                <div className={completeContainer}>
                    <Typography variant="body1" className={completeText}>Complete: </Typography>
                    <Checkbox checked={complete}/>
                </div>
            </div>
        )
    }
}