import {
    Checkbox,
    CircularProgress,
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
import { AsyncButton } from '../../Components/AsyncButton/AsyncButton';
import { IWorkflowCheckpoint, IWorkflowCheckpointCreateRequest } from '../../Models/workflow';
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
        checkpointId: '',
        removingWorkflowCheckpoint: false,
        addingOrUpdatingCheckpoint: false,
    }

    public handleChange = handleChange(this);

    constructor(props: IWorkflowPresentationProps) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
    }

    public componentWillMount(): void {
        const companyName = this.props.match.path.split('/')[2];
        Api.workflowApi.getWorkflow(companyName).then((workflow) => {
            this.setState({
                workflow,
            });
        });
    }

    public render() {
        const {
            dialogContent,
            dialogControl,
            workflowToolbar,
            workflowContainer,
            workflowRow,
            workflowPaper,
            loadingContainer,
        } = createWorkflowPresentationClasses(this.props, this.state);

        if (!this.state.workflow) {
            return (
                <div className={loadingContainer}>
                    <CircularProgress
                        color="primary"
                        size={64}
                        thickness={3}
                    />
                </div>
            )
        }

        const mappedCheckpoints = this.state.workflow.map((checkpoint) => (
                <TableRow key={checkpoint.id} onClick={this.openCheckpointDialog(checkpoint, checkpoint.id)} className={workflowRow}>
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
                                <TableCell>Estimated Completion Time</TableCell>
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
                            label="Estimated Completion Time"
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
                            <AsyncButton
                                color="primary"
                                onClick={this.handleCheckpointDelete(this.state.checkpointId)}
                                disabled={this.state.removingWorkflowCheckpoint || this.state.addingOrUpdatingCheckpoint}
                                asyncActionInProgress={this.state.removingWorkflowCheckpoint}
                            >
                                Delete
                            </AsyncButton>
                        ) : undefined}
                        <AsyncButton
                            color="secondary"
                            onClick={this.handleSave}
                            disabled={this.state.removingWorkflowCheckpoint || this.state.addingOrUpdatingCheckpoint}
                            asyncActionInProgress={this.state.addingOrUpdatingCheckpoint}
                        >
                            {this.state.isUpdate ? 'Update Checkpoint' : 'Add Checkpoint'}
                        </AsyncButton>
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

    private openCheckpointDialog = (checkpoint: IWorkflowCheckpoint, checkpointId: string) => {
        return () => {
            this.setState({
                open: true,
                estimatedCompletionTime: checkpoint.estimatedCompletionTime,
                checkpointName: checkpoint.name,
                visibleToDoctor: checkpoint.visibleToDoctor,
                isUpdate: true,
                checkpointId,
            })
        }
    }

    private handleCheckpointDelete(checkpointId: string) {
        return async() => {
            const companyId = this.props.match.path.split('/')[2];

            this.setState({
                removingWorkflowCheckpoint: true,
            })

            await Api.workflowApi.removeWorkflowCheckpoint(companyId, checkpointId);

            const workflowWithoutRemovedCheckpoint = this.state.workflow!.filter((workflowCheckpoint) => {
                return workflowCheckpoint.id !== checkpointId;
            })

            this.setState({
                open: false,
                workflow: workflowWithoutRemovedCheckpoint,
                removingWorkflowCheckpoint: false,
            });
        }
    }

    private handleClose = () => {
        this.setState({
            open: false,
        })
    }

    private async handleSave() {
        const companyId = this.props.match.path.split('/')[2];

        if (!this.state.isUpdate) {
            const checkpointCreateRequest: IWorkflowCheckpointCreateRequest = {
                name: this.state.checkpointName,
                estimatedCompletionTime: this.state.estimatedCompletionTime,
                visibleToDoctor: this.state.visibleToDoctor,
            }

            this.setState({
                addingOrUpdatingCheckpoint: true,
            })

            const addedCheckpoint = await Api.workflowApi.addWorkflowCheckpoint(companyId, checkpointCreateRequest);

            const workflowCheckpointsWithAddedCheckpoint = this.state.workflow!.concat([
                addedCheckpoint,
            ])

            this.setState({
                open: false,
                addingOrUpdatingCheckpoint: false,
                workflow: workflowCheckpointsWithAddedCheckpoint,
            })
        } else {
            const checkpointUpdateRequest: IWorkflowCheckpoint = {
                id: this.state.checkpointId,
                name: this.state.checkpointName,
                estimatedCompletionTime: this.state.estimatedCompletionTime,
                visibleToDoctor: this.state.visibleToDoctor,
            }

            this.setState({
                addingOrUpdatingCheckpoint: true,
            })

            await Api.workflowApi.updateWorkflowCheckpoint(companyId, checkpointUpdateRequest);

            const workflowCheckpointsWithUpdatedCheckpoint = this.state.workflow!.map((checkpoint) => {
                if (checkpoint.id === this.state.checkpointId) {
                    return checkpointUpdateRequest;
                } else {
                    return checkpoint;
                }
            })

            this.setState({
                open: false,
                addingOrUpdatingCheckpoint: false,
                workflow: workflowCheckpointsWithUpdatedCheckpoint,
            })
        }
    }
}

export const Workflow = withTheme()(WorkflowPresentation);