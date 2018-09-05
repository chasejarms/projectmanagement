import {
    Checkbox,
    TextField,
    Tooltip,
    Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import * as React from 'react';
import { handleChange } from '../../Utils/handleChange';
import { createWorkflowCheckpointClasses, IWorkflowCheckpointProps, IWorkflowCheckpointState } from './WorkflowCheckpoint.ias';

export class WorkflowCheckpoint extends React.Component<IWorkflowCheckpointProps, IWorkflowCheckpointState> {
    public handleChange = handleChange(this);
    
    public render() {
        const {
            workflowCheckpointContainer,
            publicCheckpointContainer,
            checkpointName,
            checkpointDescription,
            publicText,
            deleteIcon,
            nameAndDescriptionRow,
            customVisibilityAndDeadlineContainer,
            nonTrashContainer,
        } = createWorkflowCheckpointClasses(this.props, this.state);

        const {
            name,
            description,
            publicCheckpoint,
        } = this.props.workflowCheckpoint;

        return (
            <div className={workflowCheckpointContainer}>
                <Tooltip
                    title="Delete this checkpoint?"
                    placement="right">
                    <DeleteIcon className={deleteIcon}/>
                </Tooltip>
                <div className={nonTrashContainer}>
                    <div className={nameAndDescriptionRow}>
                        <TextField
                            className={checkpointName}
                            autoFocus={true}
                            label="Checkpoint Name"
                            name="checkpointName"
                            value={name}
                            onChange={this.handleChange}
                        />
                        <TextField
                            className={checkpointDescription}
                            label="Checkpoint Description"
                            name="checkpointDescription"
                            value={description}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className={customVisibilityAndDeadlineContainer}>
                        <TextField
                            className={checkpointName}
                            label="Days to complete"
                            name="daysToComplete"
                            type="number"
                            value={1}
                            onChange={this.handleChange}
                        />
                        <div className={publicCheckpointContainer}>
                            <Typography variant="body1" className={publicText}>Visible To Customer: </Typography>
                            <Checkbox checked={publicCheckpoint}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}