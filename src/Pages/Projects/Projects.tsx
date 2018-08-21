import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as React from 'react';
import { withRouter } from 'react-router';
import { slimProjects } from '../../MockData/slimProjects';
import { IProjectsPresentationProps, IProjectsPresentationState } from './Projects.ias';

export class ProjectsPresentation extends React.Component<IProjectsPresentationProps, IProjectsPresentationState> {
    public render() {
        // tslint:disable-next-line:no-console
        console.log(this.props);
        const mappedProjects = slimProjects.map(project => (
                <TableRow key={project.id} onClick={this.navigateToProject(project.id)}>
                    <TableCell>{project.projectName}</TableCell>
                    <TableCell>{project.deadlinePretty}</TableCell>
                    <TableCell>{project.currentCheckpoint}</TableCell>
                    <TableCell numeric={true}>{project.completionPercentage}</TableCell>
                </TableRow>
            )
        )

        return (
            <div>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Project Name</TableCell>
                                <TableCell>Deadline</TableCell>
                                <TableCell>Current Checkpoint</TableCell>
                                <TableCell numeric={true}>Completion (%)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mappedProjects}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }

    private navigateToProject(projectId: string): () => void{
        return () => {
            const postRoute = `/${this.props.location.pathname}/project/${projectId}`.slice(1);
            this.props.history.push(postRoute);
        }
    }
}

export const Projects = withRouter(ProjectsPresentation);