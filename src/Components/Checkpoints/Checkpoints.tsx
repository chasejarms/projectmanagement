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
import * as React from 'react';
import { ICheckpoint } from '../../Models/checkpoint';
import { handleChange } from '../../Utils/handleChange';
import { createCheckpointsClasses, ICheckpointsProps, ICheckpointsState } from './Checkpoints.ias';

const checkpoints: ICheckpoint[] = [
    {
        name: 'Finalize Contract',
        deadline: new Date(),
        complete: true,
        public: true,
        projectId: '2',
        id: '1',
    },
    {
        name: 'Initial Design Specs',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '2',
    },
    {
        name: 'Art Preview',
        description: 'Working with our designers, we create tech packs and finalize art work',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '3',
    },
    {
        name: 'Product Sample',
        description: 'The manufacturer will give us back an exact duplicate of what we can expect the product to look like',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '4',
    },
    {
        name: 'Delivery',
        deadline: new Date(),
        complete: false,
        public: true,
        projectId: '2',
        id: '5',
    }
]

export class Checkpoints extends React.Component<ICheckpointsProps, ICheckpointsState> {
    public state = {
        open: false,
        checkpointName: '',
        checkpointDescription: '',
        checkpointDeadline: '',
        isUpdate: false,
    }

    public handleChange = handleChange(this);

    public render() {
        const {
            // fabButton,
            dialogContent,
            dialogControl,
            checkpointsToolbarContainer,
            checkpointRow,
            checkpointsPaper
        } = createCheckpointsClasses(this.props, this.state);

        const mappedCheckpoints = checkpoints.map((checkpoint, index) => (
                <TableRow key={index} onClick={this.openCheckpointDialog(checkpoint, index)} className={checkpointRow}>
                    <TableCell>{checkpoint.name}</TableCell>
                    <TableCell>{this.formatDateForGrid(checkpoint.deadline!)}</TableCell>
                    <TableCell>
                        <Checkbox
                            checked={checkpoint.complete}
                        />
                    </TableCell>
                </TableRow>
            )
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
                            label="Description"
                            name="checkpointDescription"
                            value={this.state.checkpointDescription}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.handleClose}>Cancel</Button>
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
            })
        }
    }

    private handleClose = () => {
        this.setState({
            open: false,
            checkpointName: '',
            checkpointDescription: ''
        })
    }

    private handleSave = () => {
        // if (this.state.isUpdate) {

        // }
        this.setState({
            open: false,
            checkpointName: '',
            checkpointDescription: ''
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