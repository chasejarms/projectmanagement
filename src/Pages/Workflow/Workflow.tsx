import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
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
import DoneIcon from '@material-ui/icons/Done';
import * as React from 'react';
import Api from '../../Api/api';
import { IWorkflowCheckpoint } from '../../Models/workflow';
// import { WorkflowCheckpoint } from '../../Components/WorkflowCheckpoint/WorkflowCheckpoint';
import { handleChange } from '../../Utils/handleChange';
import { createWorkflowPresentationClasses, IWorkflowPresentationProps, IWorkflowPresentationState } from './Workflow.ias';

export class WorkflowPresentation extends React.Component<IWorkflowPresentationProps, IWorkflowPresentationState> {
    public state: IWorkflowPresentationState = {
        open: false,
        checkpointName: '',
        checkpointDescription: '',
        estimatedCompletionTime: '',
        visibleToDoctor: false,
        workflow: undefined,
        isUpdate: false,
        index: 0,
    }

    public handleChange = handleChange(this);

    public componentWillMount(): void {
        const workflow = Api.workflowApi.getWorkflow('any name');
        this.setState({
            workflow,
        })
    }

    public render() {
        if (!this.state.workflow) {
            return '<div></div>'
        }

        const {
            dialogContent,
            dialogControl,
            workflowToolbar,
            workflowContainer,
            workflowRow,
            workflowPaper,
        } = createWorkflowPresentationClasses(this.props, this.state);

        const mappedCheckpoints = this.state.workflow.checkpoints.map((checkpoint, index) => (
                <TableRow key={index} onClick={this.openCheckpointDialog(checkpoint, index)} className={workflowRow}>
                    <TableCell>{checkpoint.name}</TableCell>
                    <TableCell>{checkpoint.estimatedCompletionTime}</TableCell>
                    <TableCell>{checkpoint.visibleToDoctor ? (
                        <DoneIcon/>
                    ) : undefined}</TableCell>
                </TableRow>
            )
        )

        return (
            // <div className={workflowContainer}>
            //     {workflowCheckpoints}
            // </div>
            <div className={workflowContainer}>
                <Paper className={workflowPaper}>
                    <Toolbar className={workflowToolbar}>
                        <Typography variant="title">
                            Workflow
                        </Typography>
                        <Tooltip title="New Checkpoint" placement="left">
                            <IconButton
                                aria-label="New Checkpoint"
                                onClick={this.openNewCheckpointDialog}
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
                                <TableCell>Estimated Completion Days</TableCell>
                                <TableCell>Visible To Doctor</TableCell>
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
                    <DialogTitle>
                        { this.state.isUpdate ? 'Update Checkpoint' : 'Create New Checkpoint' }
                    </DialogTitle>
                    <DialogContent className={dialogContent}>
                        <TextField
                            label="Checkpoint Name"
                            name="checkpointName"
                            value={this.state.checkpointName}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                        <TextField
                            label="Estimated Completion Days"
                            name="estimatedCompletionTime"
                            value={this.state.estimatedCompletionTime}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                        <FormControlLabel className={dialogControl} control={
                            <Checkbox
                                checked={this.state.visibleToDoctor}
                                onChange={this.handleVisibleToDoctorChange}
                                name="visibleToDoctor"
                                color="primary"
                            />
                        }
                        label="Visible To Doctor"/>
                    </DialogContent>
                    <DialogActions style={{display: 'flex', justifyContent: this.state.isUpdate ? 'space-between' : 'flex-end' }}>
                        { this.state.isUpdate ? (
                            <Button color="primary" onClick={this.handleCheckpointDelete(this.state.index)}>Delete</Button>
                        ) : undefined}
                        <Button color="secondary" onClick={this.handleSave}>
                            {this.state.isUpdate ? 'Update Checkpoint' : 'Add Checkpoint' }
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    private handleVisibleToDoctorChange = (event: any) => {
        this.setState({
            visibleToDoctor: event.target.checked,
        })
    }

    private openNewCheckpointDialog = () => {
        this.setState({
            open: true,
            estimatedCompletionTime: '',
            checkpointDescription: '',
            checkpointName: '',
            isUpdate: false,
        })
    }

    private openCheckpointDialog = (checkpoint: IWorkflowCheckpoint, index: number) => {
        return () => {
            this.setState({
                open: true,
                estimatedCompletionTime: checkpoint.estimatedCompletionTime,
                checkpointName: checkpoint.name,
                visibleToDoctor: checkpoint.visibleToDoctor,
                isUpdate: true,
                index,
            })
        }
    }

    private handleCheckpointDelete = (index: number) => {
        return () => {
            const updatedCheckpoints = this.state.workflow!.checkpoints.filter((checkpoint, compareIndex) => {
                return compareIndex !== index;
            });
            Api.workflowApi.updateWorkflow('does not matter', {
                id: '',
                checkpoints: updatedCheckpoints,
            });

            const workflow = Api.workflowApi.getWorkflow('does not matter');

            this.setState({
                open: false,
                workflow,
            });
        }
    }

    private handleClose = () => {
        this.setState({
            open: false,
        })
    }

    private handleSave = () => {
        let newCheckpoints: IWorkflowCheckpoint[];
        const newCheckpoint: IWorkflowCheckpoint = {
            name: this.state.checkpointName,
            estimatedCompletionTime: this.state.estimatedCompletionTime,
            visibleToDoctor: this.state.visibleToDoctor,
        }
        if (this.state.isUpdate) {
            newCheckpoints = this.state.workflow!.checkpoints.map((checkpoint, compareIndex) => {
                if (compareIndex === this.state.index) {
                    return newCheckpoint;
                } else {
                    return checkpoint;
                }
            });
        } else {
            newCheckpoints = this.state.workflow!.checkpoints.concat([newCheckpoint])
        }

        Api.workflowApi.updateWorkflow('does not matter', {
            id: '',
            checkpoints: newCheckpoints,
        })

        const workflow = Api.workflowApi.getWorkflow('does not matter');

        this.setState({
            open: false,
            workflow,
        });
    }
}

export const Workflow = withTheme()(WorkflowPresentation);