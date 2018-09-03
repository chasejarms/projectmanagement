import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField';
// import { TextFieldProps } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
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
            completeText,
            descriptionTooltip,
        } = createCheckpointClasses(this.props, this.state);

        const formattedDate = this.formatDate(deadline);
        const tooltip = !description ? undefined : (
            <Tooltip title={description} placement="right">
                <InfoOutlinedIcon/>
            </Tooltip>
        )
        return (
            <div className={checkpointContainer}>
                <div className={nameAndDescriptionContainer}>
                    <Typography variant="title" className={descriptionTooltip}>{name}</Typography>
                    { tooltip }
                </div>
                <Typography>{formattedDate}</Typography>
                <div className={completeContainer}>
                    <Typography variant="body1" className={completeText}>Complete: </Typography>
                    <Checkbox checked={complete}/>
                </div>
            </div>
        )
    }

    private formatDate(date: Date | undefined): undefined | any {
        const formattedDate = '2014-05-24';
        if (date === undefined) {
            return '';
        } else {
            return (
                <TextField
                    type="date"
                    label="Deadline: "
                    defaultValue={formattedDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            )
        }
    }
}