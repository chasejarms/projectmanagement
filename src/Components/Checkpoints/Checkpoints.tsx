import {
    Button,
    Checkbox,
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
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ICheckpoint } from '../../Models/checkpoint';
import { addCheckpointCreator, removeCheckpointCreation, updateCheckpointCreation } from '../../Redux/ActionCreators/projectCreationActionCreators';
import { handleChange } from '../../Utils/handleChange';
import { createCheckpointsClasses, ICheckpointsProps, ICheckpointsState } from './Checkpoints.ias';

export class CheckpointsPresentation extends React.Component<ICheckpointsProps, ICheckpointsState> {
    public state = {
        open: false,
        checkpointName: '',
        checkpointDescription: '',
        checkpointDeadline: '',
        isUpdate: false,
        index: -1,
    }

    public handleChange = handleChange(this);

    public render() {
        const {
            // fabButton,
            dialogContent,
            dialogControl,
            checkpointsToolbarContainer,
            checkpointRow,
            checkpointsPaper,
            nameAndDescription,
            infoIcon,
            checkpointActionButtons,
        } = createCheckpointsClasses(this.props, this.state);

        const mappedCheckpoints = this.props.checkpoints.map((checkpoint, index) => {
                const infoOutline = !checkpoint.description ? undefined : (
                    <Tooltip title={checkpoint.description} placement="right">
                        <InfoOutlineIcon className={infoIcon}/>
                    </Tooltip>
                );
                return (
                    <TableRow key={index} onClick={this.openCheckpointDialog(checkpoint, index)} className={checkpointRow}>
                        <TableCell>
                            <div className={nameAndDescription}>
                                {checkpoint.name}
                                {infoOutline}
                            </div>
                        </TableCell>
                        <TableCell>{this.formatDateForGrid(checkpoint.deadline!)}</TableCell>
                        <TableCell>
                            <Checkbox
                                checked={checkpoint.complete}
                            />
                        </TableCell>
                    </TableRow>
                )
            }
        )

        return (
            <div>
                <Paper className={checkpointsPaper}>
                    <Toolbar className={checkpointsToolbarContainer}>
                        <Typography variant="title">
                            Checkpoints
                        </Typography>
                        <Tooltip title="New Project Checkpoint" placement="left">
                            <IconButton
                                aria-label="New Project Checkpoint"
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
                                <TableCell>Deadline</TableCell>
                                <TableCell>Complete</TableCell>
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
                        {this.state.isUpdate ? 'Update Existing Checkpoint' : 'Create New Checkpoint' }
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
                            type="date"
                            label="Deadline"
                            name="checkpointDeadline"
                            defaultValue={this.state.checkpointDeadline}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                        <TextField
                            multiline={true}
                            label="Description"
                            name="checkpointDescription"
                            value={this.state.checkpointDescription}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogActions className={checkpointActionButtons}>
                        <Button color="primary" onClick={this.handleDelete(this.state.index)}>Delete</Button>
                        <Button color="secondary" onClick={this.handleSave}>
                            {this.state.isUpdate ? 'Update Checkpoint' : 'Add Checkpoint'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    private formatDateForPicker(date: Date): string {
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        if (day.length === 1) {
            day = `0${day}`;
        }

        if (month.length === 1) {
            month = `0${month}`;
        }
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }

    private formatDateForGrid(date: Date): string {
        const day = date.getDate().toString();
        const month = (date.getMonth() + 1).toString();
        const year = date.getFullYear().toString().slice(2);

        return `${month}/${day}/${year}`;
    }

    private openCheckpointDialog = (checkpoint: ICheckpoint, index: number) => {
        return () => {
            this.setState({
                open: true,
                checkpointName: checkpoint.name,
                checkpointDescription: checkpoint.description!,
                checkpointDeadline: this.formatDateForPicker(checkpoint.deadline!),
                isUpdate: true,
                index,
            });
        }
    }

    private handleClose = () => {
        this.setState({
            open: false,
        })
    }

    private handleDelete = (index: number) => {
        return () => {
            this.setState({
                open: false,
            });
            this.props.removeCheckpoint(this.props.projectCreation)(index);
        }
    }

    private handleSave = () => {
        // const checkpointsClone = _.cloneDeep(this.props.checkpoints);
        const deadlineFromString = new Date(this.state.checkpointDeadline);
        const newCheckpoint: ICheckpoint = {
            name: this.state.checkpointName,
            description: this.state.checkpointDescription,
            complete: false,
            id: Date.now().toString(),
            projectId: '1',
            deadline: deadlineFromString,
        }

        if (this.state.isUpdate) {
            this.props.updateCheckpoint(this.props.projectCreation)(this.state.index, newCheckpoint);
        } else {
            this.props.addCheckpoint(this.props.projectCreation)(newCheckpoint);
        }

        this.setState({
            open: false,
        })
    }

    private openNewCheckpointDialog = () => {
        this.setState({
            open: true,
            checkpointName: '',
            checkpointDescription: '',
            checkpointDeadline: this.formatDateForPicker(new Date()),
            isUpdate: false,
        })
    }

    // private formatDate = (date: Date) => {
    //     return '9/17/18';
    // }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addCheckpoint: (isProjectCreation: boolean) => (checkpoint: ICheckpoint) => {
        if (isProjectCreation) {
            const projectCreationAddCheckpointAction = addCheckpointCreator(checkpoint);
            dispatch(projectCreationAddCheckpointAction);
        }
    },
    removeCheckpoint: (isProjectCreation: boolean) => (index: number) => {
        if (isProjectCreation) {
            const projectCreationRemoveCheckpointAction = removeCheckpointCreation(index);
            dispatch(projectCreationRemoveCheckpointAction);
        }
    },
    updateCheckpoint: (isProjectCreation: boolean) => (index: number, checkpoint: ICheckpoint) => {
        if (isProjectCreation) {
            const projectCreationUpdateCheckpointAction = updateCheckpointCreation(index, checkpoint);
            dispatch(projectCreationUpdateCheckpointAction);
        }
    },
})

export const Checkpoints = connect(undefined, mapDispatchToProps)(CheckpointsPresentation);