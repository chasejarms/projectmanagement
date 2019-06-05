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
import { withRouter } from 'react-router';
import Api from '../../Api/api';
import { createWorkflowsClasses, IWorkflowsProps, IWorkflowsState } from './Workflows.ias';

export class WorkflowsPresentation extends React.Component<IWorkflowsProps, IWorkflowsState> {
    public state: IWorkflowsState = {
        workflows: [],
    }

    // tslint:disable-next-line:variable-name
    private _isMounted: boolean = false;

    public async componentWillMount(): Promise<void> {
        this._isMounted = true;
        const companyId = this.props.location.pathname.split('/')[2];

        const workflows = await Api.workflowApi.getWorkflows(companyId);
        // tslint:disable-next-line:no-console
        console.log('workflows: ', workflows);
        if (this._isMounted) {
            this.setState({
                workflows,
            })
        }
    }

    public async componentWillUnmount(): Promise<void> {
        this._isMounted = false;
    }

    public render() {
        const {
            workflowsContainer,
            workflowsPaper,
            workflowsToolbarContainer,
            workflowRow,
        } = createWorkflowsClasses(this.props, this.state);

        const mappedWorkflows = this.state.workflows.map((workflow) => {
            return (
                <TableRow key={workflow.id} onClick={this.navigateToWorkflow(workflow.id)} className={workflowRow}>
                    <TableCell>{workflow.name}</TableCell>
                    <TableCell>{workflow.workflowCheckpointIds.length}</TableCell>
                </TableRow>
            )
        });

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
                            {mappedWorkflows}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }

    private navigateToWorkflow = (workflowId: string) => () => {
        this.props.history.push(`${this.props.match.url}/${workflowId}`);
    }

    private navigateToWorkflowCreation = () => {
        //
    }
}

export const Workflows = withRouter(WorkflowsPresentation);