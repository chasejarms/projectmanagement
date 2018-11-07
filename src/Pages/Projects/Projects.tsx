import {
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { withRouter } from 'react-router';
import Api from '../../Api/api';
import { createProjectsPresentationClasses, IProjectsPresentationProps, IProjectsPresentationState } from './Projects.ias';

export class ProjectsPresentation extends React.Component<IProjectsPresentationProps, IProjectsPresentationState> {
    public state: IProjectsPresentationState = {}

    public componentWillMount(): void {
        const slimProjects = Api.projectsApi.getSlimProjects('does not matter');
        this.setState({
            slimProjects,
        });
    }

    public render() {
        if (!this.state.slimProjects) {
            return <div/>;
        }

        const {
            rowStyling,
            projectsContainer,
            projectsToolbarContainer,
            projectsPaper,
        } = createProjectsPresentationClasses(this.props, this.state);

        const mappedProjects = this.state.slimProjects.map(slimProject => (
                <TableRow key={slimProject.id} onClick={this.navigateToProject(slimProject.projectId)} className={rowStyling}>
                    <TableCell>{slimProject.projectName}</TableCell>
                    <TableCell>{slimProject.currentCheckpoint}</TableCell>
                    <TableCell>{slimProject.nextCheckpointDeadlinePretty}</TableCell>
                    <TableCell/>
                </TableRow>
            )
        )

        return (
            <div className={projectsContainer}>
                <Paper className={projectsPaper}>
                    <Toolbar className={projectsToolbarContainer}>
                        <Typography variant="title">
                            Cases
                        </Typography>
                        <Tooltip title="New Case" placement="left">
                            <IconButton
                                aria-label="New Case"
                                onClick={this.navigateToCreateProjectPage}
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
                                <TableCell>Case Name</TableCell>
                                <TableCell>Current Checkpoint</TableCell>
                                <TableCell>Case Deadline</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {mappedProjects}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }

    private navigateToProject(projectId: string): () => void{
        return () => {
            const postRoute = `${this.props.location.pathname}/project/${projectId}`;
            this.props.history.push(postRoute);
        }
    }

    private navigateToCreateProjectPage = () => {
        this.props.history.push(`${this.props.location.pathname}/createProject`);
    }
}

export const Projects = withRouter(ProjectsPresentation);