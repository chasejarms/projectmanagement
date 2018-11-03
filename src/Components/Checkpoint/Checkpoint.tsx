import Checkbox from '@material-ui/core/Checkbox'
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
            complete,
        } = this.props.checkpoint;

        const {
            checkpointContainer,
            nameAndDescriptionContainer,
            completeContainer,
            completeText,
            descriptionTooltip,
        } = createCheckpointClasses(this.props, this.state);

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
                <Typography>something</Typography>
                <div className={completeContainer}>
                    <Typography variant="body1" className={completeText}>Complete: </Typography>
                    <Checkbox checked={complete}/>
                </div>
            </div>
        )
    }
}