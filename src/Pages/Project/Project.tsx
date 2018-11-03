import { withTheme } from '@material-ui/core';
import {
    Button,
    Paper,
    TextField,
} from '@material-ui/core';
import * as React from 'react';
import { withRouter } from 'react-router';
import Api from '../../Api/api';
import { Chat } from '../../Components/Chat/Chat';
import { ProjectProgress } from '../../Components/ProjectProgress/ProjectProgress';
import { ProjectUsers } from '../ProjectUsers/ProjectUsers';
import { createProjectPresentationClasses, IProjectPresentationProps, IProjectPresentationState } from './Project.ias';

class ProjectPresentation extends React.Component<IProjectPresentationProps, IProjectPresentationState> {
    public state = {
        tabValue: 1,
        projectName: '',
    }

    public tabComponents = {
        0: undefined,
        1: <ProjectProgress key={1} theme={this.props.theme}/>,
        2: <ProjectUsers key={2}/>,
        3: <Chat theme={this.props.theme} key={3} staffChat={true}/>,
        4: <Chat theme={this.props.theme} key={4} staffChat={false}/>,
    }

    constructor(props: IProjectPresentationProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public componentWillMount(): void {
        const projectId = this.props.match.params['projectId'];
        const projectName = Api.projectsApi.getProjectName('does not matter', projectId);
        this.setState({
            projectName,
        })
    }

    public handleChange(event: any, value: number): void {
        this.setState({
            tabValue: value,
        })
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
        } = createProjectPresentationClasses(this.props, this.state, this.props.theme);

        return (
            <div className={projectContainer}>
                <div className={halfWidthProjectContainer}>
                    <Paper className={evenPaper}>
                        <TextField
                            fullWidth={true}
                            className={fieldSpacing}
                            label="Case Name"
                            name="projectName"
                            value={this.state.projectName}
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
                        />
                    </Paper>
                </div>
                <div className={halfWidthProjectContainer}>
                    <Paper className={secondPaper}>
                        <TextField
                            fullWidth={true}
                            className={fieldSpacing}
                            id="date"
                            type="date"
                            value="2018-10-10"
                            label="Case Delivery Date"
                            name="caseDeadline"
                        />
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
            </div>
        );
    }

    // private navigateBackToProjectsPage = (): void => {
    //     const splitPath = this.props.location.pathname.split('/');
    //     this.props.history.push(`/${splitPath[1]}/${splitPath[2]}`);
    // }
}

export const Project = withRouter(withTheme()(ProjectPresentation));