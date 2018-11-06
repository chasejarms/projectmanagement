import { withTheme } from '@material-ui/core';
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Typography,
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import * as React from 'react';
import { withRouter } from 'react-router';
import Api from '../../Api/api';
import { ICheckpoint } from '../../Models/checkpoint';
import { createProjectPresentationClasses, IProjectPresentationProps, IProjectPresentationState } from './Project.ias';

class ProjectPresentation extends React.Component<IProjectPresentationProps, IProjectPresentationState> {
    public state = {
        project: null,
    }

    constructor(props: IProjectPresentationProps) {
        super(props);
    }

    public componentWillMount(): void {
        const projectId = this.props.match.params['projectId'];

        const project = Api.projectsApi.getProject(projectId);
        // tslint:disable-next-line:no-console
        console.log(project);
        this.setState({
            project,
        });
    }

    public render() {
        const {
            attachmentButtonsContainer,
            projectContainer,
            evenPaper,
            secondPaper,
            fieldSpacing,
            halfWidthProjectContainer,
            seeAttachmentsButton,
            workflowToolbar,
        } = createProjectPresentationClasses(this.props, this.state, this.props.theme);

        const mappedCheckpoints = (this.state.project as any).checkpoints.map((checkpoint: ICheckpoint, index: number) => (
                <TableRow key={index}>
                    <TableCell>{checkpoint.name}</TableCell>
                    <TableCell>{checkpoint.estimatedCompletionTime}</TableCell>
                    <TableCell>{checkpoint.complete ? (
                        <DoneIcon/>
                    ) : undefined}</TableCell>
                </TableRow>
            )
        )

        return (
            <div className={projectContainer}>
                <div className={halfWidthProjectContainer}>
                    <Paper className={secondPaper}>
                        <div>
                            <Toolbar className={workflowToolbar}>
                                <Typography variant="title">
                                    Case Progress
                                </Typography>
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
                                        <TableCell>Complete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mappedCheckpoints}
                                </TableBody>
                            </Table>
                        </div>
                        <div className={attachmentButtonsContainer}>
                            <Button
                                className={seeAttachmentsButton}
                                variant="contained"
                                color="secondary">
                                See Attachments (1)
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary">
                                Add An Attachment
                            </Button>
                        </div>
                    </Paper>
                </div>
                <div className={halfWidthProjectContainer}>
                    <Paper className={evenPaper}>
                        <TextField
                            fullWidth={true}
                            className={fieldSpacing}
                            label="Case Name"
                            name="projectName"
                            value={(this.state.project! as any).name}
                            onChange={this.handleProjectNameChange}
                        />
                        <TextField
                            fullWidth={true}
                            className={fieldSpacing}
                            id="date"
                            type="date"
                            value="2018-10-10"
                            label="Case Delivery Date"
                            name="caseDeadline"
                        />
                        <TextField
                            fullWidth={true}
                            multiline={true}
                            label="Case Notes"
                            name="projectNotes"
                            value={(this.state.project as any).notes}
                            onChange={this.handleNotesChange}
                        />
                    </Paper>
                </div>
            </div>
        );
    }

    private handleProjectNameChange = (event: any): void => {
        this.setState({
            project: {
                ...this.state.project as any,
                name: event.target.value,
            }
        })
    }

    private handleNotesChange = (event: any): void => {
        this.setState({
            project: {
                ...this.state.project as any,
                notes: event.target.value,
            }
        })
    }
}

export const Project = withRouter(withTheme()(ProjectPresentation));