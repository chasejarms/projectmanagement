import {
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    Input,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Tooltip,
    Typography,
    withTheme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import * as React from 'react';
import { FormControlState } from 'src/Classes/formControlState';
import { requiredValidator } from 'src/Validators/required.validator';
import Api from '../../Api/api';
import { AsyncButton } from '../../Components/AsyncButton/AsyncButton';
import { IWorkflowCheckpoint, IWorkflowCheckpointCreateRequest } from '../../Models/workflow';
import { handleChange } from '../../Utils/handleChange';
import { createWorkflowPresentationClasses, IWorkflowPresentationProps, IWorkflowPresentationState } from './Workflow.ias';

export class WorkflowPresentation extends React.Component<IWorkflowPresentationProps, IWorkflowPresentationState> {
    public state: IWorkflowPresentationState = {
        open: false,
        checkpointName: new FormControlState({
            value: '',
            validators: [requiredValidator('A name is required')],
        }),
        checkpointDescription: '',
        estimatedCompletionTime: new FormControlState({
            value: '',
            validators: [requiredValidator('An estimated completion time is required')],
        }),
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

        const mappedCheckpoints = this.state.workflow.map((checkpoint, index) => (
                <TableRow key={checkpoint.id} className={workflowRow}>
                    <TableCell onClick={this.openCheckpointDialog(checkpoint, checkpoint.id)}>{checkpoint.name}</TableCell>
                    <TableCell onClick={this.openCheckpointDialog(checkpoint, checkpoint.id)}>{checkpoint.estimatedCompletionTime}</TableCell>
                    <TableCell onClick={this.openCheckpointDialog(checkpoint, checkpoint.id)}>{checkpoint.visibleToDoctor ? (
                        <DoneIcon/>
                    ) : undefined}</TableCell>
                    <TableCell>
                        <Select
                            fullWidth={true}
                            value={index}
                            onChange={this.handleCheckpointOrderChange(index)}
                        >
                            {this.state.workflow!.map((_, innerIndex) => {
                                return (
                                    <MenuItem key={`${index}_${innerIndex}`} value={innerIndex}>
                                        {innerIndex + 1}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </TableCell>
                </TableRow>
            )
        )

        const checkpointNameError = this.state.checkpointName.shouldShowError() ? this.state.checkpointName.errors[0] : undefined;
        const estimatedCompletionError = this.state.estimatedCompletionTime.shouldShowError() ? this.state.estimatedCompletionTime.errors[0] : undefined;

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
                    </Toolbar>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Checkpoint Name</TableCell>
                                <TableCell>Estimated Completion Time</TableCell>
                                <TableCell>Visible To Doctor</TableCell>
                                <TableCell>Checkpoint Order</TableCell>
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
                        <FormControl required={true} className={dialogControl} error={this.state.checkpointName.shouldShowError()}>
                            <InputLabel>Checkpoint Name</InputLabel>
                            <Input
                                autoFocus={true}
                                name="checkpointName"
                                value={this.state.checkpointName.value}
                                onChange={this.handleCheckpointNameChange}
                            />
                            <FormHelperText>{checkpointNameError}</FormHelperText>
                        </FormControl>
                        <FormControl required={true} className={dialogControl} error={this.state.estimatedCompletionTime.shouldShowError()}>
                            <InputLabel>Estimated Completion Time</InputLabel>
                            <Input
                                name="estimatedCompletionTime"
                                value={this.state.estimatedCompletionTime.value}
                                onChange={this.handleEstimatedCompletionTimeChange}
                            />
                            <FormHelperText>{estimatedCompletionError}</FormHelperText>
                        </FormControl>
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
                            disabled={this.state.removingWorkflowCheckpoint || this.state.addingOrUpdatingCheckpoint || this.workflowIsInvalid()}
                            asyncActionInProgress={this.state.addingOrUpdatingCheckpoint}
                        >
                            {this.state.isUpdate ? 'Update Checkpoint' : 'Add Checkpoint'}
                        </AsyncButton>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    private handleCheckpointNameChange = (event: any): void => {
        const newCheckpointName = event.target.value;
        const updatedFormControlState = this.state.checkpointName.setValue(newCheckpointName);
        this.setState({
            checkpointName: updatedFormControlState,
        })
    }

    private handleEstimatedCompletionTimeChange = (event: any): void => {
        const newEstimatedCompletionTime = event.target.value;
        const updatedFormControlState = this.state.estimatedCompletionTime.setValue(newEstimatedCompletionTime);
        this.setState({
            estimatedCompletionTime: updatedFormControlState,
        })
    }

    private workflowIsInvalid = (): boolean => {
        const {
            estimatedCompletionTime,
            checkpointName,
        } = this.state;

        return estimatedCompletionTime.invalid || checkpointName.invalid;
    }

    private handleCheckpointOrderChange = (currentIndex: number) => (event: any) => {
        const companyId = this.props.match.path.split('/')[2];

        const futureIndex = event.target.value;
        const checkpointThatChangesPosition = this.state.workflow![currentIndex];
        const updatedWorkflow = this.state.workflow!.filter((compareCheckpoint) => {
            return checkpointThatChangesPosition.id !== compareCheckpoint.id;
        });

        updatedWorkflow.splice(futureIndex, 0, checkpointThatChangesPosition);

        this.setState({
            workflow: updatedWorkflow,
        })

        const updatedWorkflowOrderIds = updatedWorkflow.map((updatedWorkflowCheckpoint) => {
            return updatedWorkflowCheckpoint.id;
        });

        Api.workflowApi.updateWorkflowCheckpointOrder(companyId, updatedWorkflowOrderIds);
    }

    private handleVisibleToDoctorChange = (event: any) => {
        this.setState({
            visibleToDoctor: event.target.checked,
        })
    }

    private openNewCheckpointDialog = () => {
        this.setState({
            open: true,
            estimatedCompletionTime: this.state.estimatedCompletionTime
                .setValue('')
                .markAsInvalid(),
            checkpointDescription: '',
            checkpointName: this.state.estimatedCompletionTime
                .setValue('')
                .markAsInvalid(),
            isUpdate: false,
            visibleToDoctor: false,
        })
    }

    private openCheckpointDialog = (checkpoint: IWorkflowCheckpoint, checkpointId: string) => {
        return () => {
            this.setState({
                open: true,
                estimatedCompletionTime: this.state.estimatedCompletionTime
                    .setValue(checkpoint.estimatedCompletionTime)
                    .markAsPristine()
                    .markAsUntouched()
                    .markAsValid(),
                checkpointName: this.state.checkpointName
                    .setValue(checkpoint.name)
                    .markAsPristine()
                    .markAsTouched()
                    .markAsValid(),
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
                name: this.state.checkpointName.value,
                estimatedCompletionTime: this.state.estimatedCompletionTime.value,
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
                name: this.state.checkpointName.value,
                estimatedCompletionTime: this.state.estimatedCompletionTime.value,
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