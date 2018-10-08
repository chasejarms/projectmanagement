import {
    // Button,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    withTheme,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
// import FilterListIcon from '@material-ui/icons/FilterList';
import * as React from 'react';
import { withRouter } from 'react-router';
import { slimProjects } from '../../MockData/slimProjects';
import { createMyProjectsPresentationClasses, IMyProjectsPresentationProps, IMyProjectsPresentationState } from './MyProjects.ias';

export class MyProjectsPresentation extends React.Component<IMyProjectsPresentationProps, IMyProjectsPresentationState> {
    public render() {
        const {
            rowStyling,
            myProjectsContainer,
            // fabButton,
            myProjectsToolbarContainer,
            projectsTypography,
            projectsPaper,
        } = createMyProjectsPresentationClasses(this.props, this.state);

        const mappedMyProjects = slimProjects.map(project => (
                <TableRow key={project.id} onClick={this.navigateToProject(project.id)} className={rowStyling}>
                    <TableCell>{project.projectName}</TableCell>
                    <TableCell>{project.currentCheckpoint}</TableCell>
                    <TableCell>{project.nextCheckpointDeadlinePretty}</TableCell>
                </TableRow>
            )
        )

        return (
            <div className={myProjectsContainer}>
                <Paper className={projectsPaper}>
                    <Toolbar className={myProjectsToolbarContainer}>
                        <Typography variant="title" className={projectsTypography}>
                            My Projects
                        </Typography>
                        <Tooltip title="New Project" placement="left">
                            <IconButton
                                aria-label="New Project"
                                onClick={this.navigateToCreateProjectPage}
                                color="secondary"
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                        {/* <Button
                            type="button'"
                            onClick={this.navigateToCreateProjectPage}
                            // variant="fab"
                            color="primary">
                            Create Project
                        </Button> */}
                        {/* <Tooltip title="Filter list">
                            <IconButton aria-label="Filter list">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip> */}
                    </Toolbar>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Project Name</TableCell>
                                <TableCell>Current Checkpoint</TableCell>
                                <TableCell>Current Checkpoint Deadline</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {mappedMyProjects}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }

    private navigateToProject(projectId: string): () => void{
        return () => {
            const pathWithoutMyProject = `${this.props.location.pathname}`.replace('/myProjects', '');
            const postRoute = `${pathWithoutMyProject}/project/${projectId}`;
            this.props.history.push(postRoute);
        }
    }

    private navigateToCreateProjectPage = () => {
        const pathWithoutMyProject = `${this.props.location.pathname}`.replace('/myProjects', '');
        const newPath = `${pathWithoutMyProject}/createProject`;
        this.props.history.push(newPath);
    }
}

export const MyProjects = withTheme()(withRouter(MyProjectsPresentation));