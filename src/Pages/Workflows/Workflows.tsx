import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Tooltip,
    Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { createWorkflowsClasses, IWorkflowsProps, IWorkflowsState } from './Workflows.ias';

export class Workflows extends React.Component<IWorkflowsProps, IWorkflowsState> {
    public render() {
        const {
            workflowsContainer,
            workflowsPaper,
            workflowsToolbarContainer,
        } = createWorkflowsClasses(this.props, this.state);

        return (
            <div className={workflowsContainer}>
                <Paper className={workflowsPaper}>
                    <Toolbar className={workflowsToolbarContainer}>
                        <Typography variant="title">
                            Workflows
                        </Typography>
                        <Tooltip title="New User" placement="left" disableFocusListener={true}>
                            <IconButton
                                aria-label="New User"
                                onClick={this.navigateToWorkflowCreation}
                                color="secondary"
                                type="button"
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Number of Checkpoints</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.mappedUsers()}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }

    private mappedUsers = () => {
        // actually return the workflows here
        return (
            <div>Something</div>
        )
    }

    private navigateToWorkflowCreation = () => {
        //
    }
}