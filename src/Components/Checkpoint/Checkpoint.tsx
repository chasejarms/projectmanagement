import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
// import { TextFieldProps } from '@material-ui/core';
import * as React from 'react';
import { createCheckpointClasses, ICheckpointProps, ICheckpointState } from './Checkpoint.ias';

export class Checkpoint extends React.Component<ICheckpointProps, ICheckpointState> {
    public render() {
        const {
            name,
            description,
            deadline,
            complete,
        } = this.props.checkpoint;

        const {
            checkpointContainer,
            nameAndDescriptionContainer,
            completeContainer,
        } = createCheckpointClasses(this.props, this.state);

        const formattedDate = this.formatDate(deadline);
        return (
            <div className={checkpointContainer}>
                <div className={nameAndDescriptionContainer}>
                    <Typography>{name}</Typography>
                    <Typography>{description}</Typography>
                </div>
                <Typography>{formattedDate}</Typography>
                <div className={completeContainer}>
                    <Typography>Complete: </Typography>
                    <Checkbox checked={complete}/>
                </div>
            </div>
        )
    }

    private formatDate(date: Date | undefined): undefined | React.ComponentType<TextFieldProps> {
        if (date === undefined) {
            return '';
        } else {
            return (
                <TextField
                    type="date"
                    label="Deadline: "
                    value={formattedDate}
                />
            )
        }
    }
}