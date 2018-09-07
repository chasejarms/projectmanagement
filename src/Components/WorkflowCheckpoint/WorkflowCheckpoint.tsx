import {
    Checkbox,
    TextField,
    Tooltip,
    Typography,
    withTheme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import * as React from 'react';
import { handleChange } from '../../Utils/handleChange';
import { createWorkflowCheckpointClasses, IWorkflowCheckpointProps, IWorkflowCheckpointState } from './WorkflowCheckpoint.ias';

export class WorkflowCheckpointPresentation extends React.Component<IWorkflowCheckpointProps, IWorkflowCheckpointState> {
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
            daysToCompleteStying,
            actionsContainer,
            nonActionButtonContainer,
            newCheckpointAfterIcon,
            newCheckpointBeforeIcon,
            // nonTrashContainer,
        } = createWorkflowCheckpointClasses(this.props, this.state);

        const {
            name,
            description,
            publicCheckpoint,
            deadlineFromLastCheckpoint,
        } = this.props.workflowCheckpoint;

        const daysToCompleteText = this.props.isFirstCheckpoint ?
            'Days to complete from project creation' :
            'Days to complete from last checkpoint';

        return (
            <div className={workflowCheckpointContainer}>
                <div className={`${nonActionButtonContainer} non-action-buttons`}>
                    <div className={nameAndDescriptionRow}>
                        <TextField
                            className={checkpointName}
                            label="Name"
                            name="checkpointName"
                            value={name}
                            onChange={this.handleChange}
                        />
                         <TextField
                            className={daysToCompleteStying}
                            label={daysToCompleteText}
                            name="daysToComplete"
                            type="number"
                            value={deadlineFromLastCheckpoint}
                            onChange={this.handleChange}
                        />
                        <div className={publicCheckpointContainer}>
                            <Typography variant="body1" className={publicText}>Visible To Customer: </Typography>
                            <Checkbox checked={publicCheckpoint}/>
                        </div>
                    </div>
                    <div className={customVisibilityAndDeadlineContainer}>
                        <TextField
                            className={checkpointDescription}
                            label="Description"
                            name="checkpointDescription"
                            value={description}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className={`${actionsContainer} action-buttons`}>
                    <Tooltip
                        title="Add checkpoint before"
                        placement="left">
                        <AddIcon className={newCheckpointBeforeIcon}/>
                    </Tooltip>
                    <Tooltip
                        title="Delete this checkpoint"
                        placement="left">
                        <DeleteIcon className={deleteIcon}/>
                    </Tooltip>
                    <Tooltip
                        title="Add checkpoint after"
                        placement="left">
                        <AddIcon className={newCheckpointAfterIcon}/>
                    </Tooltip>
                </div>
            </div>
        )
    }
}

export const WorkflowCheckpoint = withTheme()(WorkflowCheckpointPresentation);