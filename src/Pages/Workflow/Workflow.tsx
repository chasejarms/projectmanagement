import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    withTheme,

} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
// import { WorkflowCheckpoint } from '../../Components/WorkflowCheckpoint/WorkflowCheckpoint';
import { workflow } from '../../MockData/workflow';
import { handleChange } from '../../Utils/handleChange';
import { createWorkflowPresentationClasses, IWorkflowPresentationProps, IWorkflowPresentationState } from './Workflow.ias';

export class WorkflowPresentation extends React.Component<IWorkflowPresentationProps, IWorkflowPresentationState> {
    public state = {
        open: false,
        checkpointName: '',
        checkpointDescription: '',
        checkpointDays: 0,
    }

    public handleChange = handleChange(this);

    public render() {
        const {
            dialogContent,
            dialogControl,
            workflowToolbar,
            workflowContainer,
            workflowRow,
        } = createWorkflowPresentationClasses(this.props, this.state);

        const mappedCheckpoints = workflow.checkpoints.map((checkpoint, index) => (
                <TableRow key={index} onClick={this.openCheckpointDialog} className={workflowRow}>
                    <TableCell>{checkpoint.name}</TableCell>
                    <TableCell>{checkpoint.deadlineFromLastCheckpoint}</TableCell>
                    <TableCell>{checkpoint.description}</TableCell>
                </TableRow>
            )
        )

        return (
            // <div className={workflowContainer}>
            //     {workflowCheckpoints}
            // </div>
            <div className={workflowContainer}>
                <Paper>
                    <Toolbar className={workflowToolbar}>
                        <Typography variant="title">
                            Workflow
                        </Typography>
                        <Tooltip title="New Checkpoint" placement="left">
                            <IconButton
                                aria-label="New Checkpoint"
                                onClick={this.openCheckpointDialog}
                                color="secondary"
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Filter list">
                            <IconButton aria-label="Filter list">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip> */}
                    </Toolbar>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Checkpoint Name</TableCell>
                                <TableCell>Days to complete from previous checkpoint (or from project creation for first checkpoint)</TableCell>
                                <TableCell>Checkpoint Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mappedCheckpoints}
                        </TableBody>
                    </Table>
                </Paper>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>Create New Checkpoint</DialogTitle>
                    <DialogContent className={dialogContent}>
                        <TextField
                            label="Checkpoint Name"
                            name="checkpointName"
                            value={this.state.checkpointName}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="number"
                            label="Days To Complete from last checkpoint"
                            name="checkpointDays"
                            value={this.state.checkpointDays}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                        <TextField
                            label="Description"
                            name="checkpointDescription"
                            value={this.state.checkpointDescription}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={this.handleSave}>Add Checkpoint</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    private openCheckpointDialog = () => {
        this.setState({
            open: true,
        })
    }

    private handleClose = () => {
        this.setState({
            open: false,
            checkpointName: '',
            checkpointDescription: '',
            checkpointDays: 0,
        })
    }

    private handleSave = () => {
        this.setState({
            open: false,
            checkpointName: '',
            checkpointDescription: '',
            checkpointDays: 0,
        })
    }
}

export const Workflow = withTheme()(WorkflowPresentation);