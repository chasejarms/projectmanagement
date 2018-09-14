import {
    Button,
    // IconButton,
    Toolbar,
    // Tooltip,
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
            fabButton,
            myProjectsToolbarContainer,
            projectsTypography,
        } = createMyProjectsPresentationClasses(this.props, this.state);

        const mappedMyProjects = slimProjects.map(project => (
                <TableRow key={project.id} onClick={this.navigateToProject(project.id)} className={rowStyling}>
                    <TableCell>{project.projectName}</TableCell>
                    <TableCell>{project.currentCheckpoint}</TableCell>
                    <TableCell>{project.deadlinePretty}</TableCell>
                </TableRow>
            )
        )

        return (
            <div className={myProjectsContainer}>
                <Paper>
                    <Toolbar className={myProjectsToolbarContainer}>
                        <Typography variant="title" className={projectsTypography}>
                            My Projects
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
                <Button
                    type="button'"
                    onClick={this.navigateToCreateProjectPage}
                    variant="fab"
                    color="primary"
                    className={fabButton}>
                    <AddIcon/>
                </Button>
            </div>
        )
    }

    private navigateToProject(projectId: string): () => void{
        return () => {
            const pathWithoutMyProject = `${this.props.location.pathname}`.replace('myProjects', '');
            const postRoute = `${pathWithoutMyProject}project/${projectId}`;
            this.props.history.push(postRoute);
        }
    }

    private navigateToCreateProjectPage = () => {
        this.props.history.push(`${this.props.location.pathname}/createProject`);
    }
}

export const MyProjects = withTheme()(withRouter(MyProjectsPresentation));