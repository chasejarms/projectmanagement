import {
    Button,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    withTheme,
} from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';
import Api from '../../Api/api';
import { IProject } from '../../Models/project';
import { IProjectCreationProjectUser } from '../../Models/projectUser';
import { deleteProjectUserActionCreator, getInitialCheckpoints, setProjectNameCreator, updateProjectUserActionCreator } from '../../Redux/ActionCreators/projectCreationActionCreators';
import { addProjectUserActionCreator } from '../../Redux/ActionCreators/projectCreationActionCreators';
import { IAppState } from '../../Redux/Reducers/rootReducer';
import { handleChange } from '../../Utils/handleChange';
import {
    createProjectCreationClasses,
    IProjectCreationProps,
    IProjectCreationState,
} from './ProjectCreation.ias';

export class ProjectCreationPresentation extends React.Component<IProjectCreationProps, IProjectCreationState> {
    public myRef: React.RefObject<{}>;
    public state = {
        open: false,
        activeStep: 0,
        projectName: '',
        checkpoints: [],
        userName: '',
        checkpointStatus: '',
        role: '',
        additionalCheckpoints: new Set<string>([]),
        isUpdate: false,
        index: -1,
        popperIsOpen: true,
        user: {} as any,
        caseDeadline: new Date(),
        projectNotes: '',
    };

    public handleChange = handleChange(this);

    constructor(props: IProjectCreationProps) {
        super(props);
        this.myRef = React.createRef();
    }

    public handleProjectNameChange = (event: any) => {
        // tslint:disable-next-line:no-console
        const projectName = event.target.value;
        this.props.updateProjectName(projectName);
    }

    public componentWillMount() {
        this.props.getInitialProjectCreationCheckpoints();
    }

    public render() {
        const {
            projectCreationContainer,
            stepperContainer,
            topBar,
            topBarContainer,
            fullWidthPaper,
        } = createProjectCreationClasses(this.props, this.state);

        return (
            <div className={projectCreationContainer}>
                <div className={topBarContainer}>
                    <div className={topBar}>
                        <Paper className={fullWidthPaper}>
                            <Stepper activeStep={this.state.activeStep} className={stepperContainer}>
                                <Step>
                                    <StepLabel>Case Name</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>Case Delivery Date</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>Case Notes And Attachments</StepLabel>
                                </Step>
                            </Stepper>
                            <div>
                                {this.createActionButtons()}
                            </div>
                        </Paper>
                    </div>
                </div>
                {this.getStepActiveContent()}
            </div>
        )
    }

    private onNextClick = () => {
        this.setState({
            activeStep: this.state.activeStep + 1,
        })
    }

    private onBackClick = () => {
        this.setState({
            activeStep: this.state.activeStep - 1,
        })
    }

    private createProject = () => {
        const projectToCreate: IProject = {
            id: Date.now().toString(),
            name: this.props.projectCreation.projectName,
            checkpoints: this.props.projectCreation.checkpoints,
            users: this.props.projectCreation.projectUsers,
            complete: false,
        };
        Api.projectsApi.createProject('does not matter', projectToCreate);
        const companyName = this.props.match.path.split('/')[2];
        this.props.history.push(`/company/${companyName}/project/${projectToCreate.id}`);
    }

    private createActionButtons(): any {
        const {
            actionButtonContainer,
            baseActionButton,
        } = createProjectCreationClasses(this.props, this.state);

        const backButton = this.state.activeStep !== 0 ? (
            <Button
                className={baseActionButton}
                variant="contained"
                onClick={this.onBackClick}
                color="secondary">
                Back
            </Button>
        ) : undefined;

        const nextButton = this.state.activeStep !== 2 ? (
            <Button
                className={baseActionButton}
                variant="contained"
                onClick={this.onNextClick}
                color="secondary">
                Next
            </Button>
        ) : undefined;

        const saveButton = this.state.activeStep === 2 ? (
            <Button
                className={baseActionButton}
                variant="contained"
                onClick={this.createProject}
                color="secondary">
                Create Project
            </Button>
        ) : undefined;

        return (
        <div className={actionButtonContainer}>
            {backButton}
            {nextButton}
            {saveButton}
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

    private getStepActiveContent(): any {
        const {
            stepperContent,
            projectNameContainer,
            projectName,
            usersContainer,
            paper,
            projectNotesContainer,
            projectNotesInput,
        } = createProjectCreationClasses(this.props, this.state);

        if (this.state.activeStep === 0) {
            return (
                <div className={`${stepperContent} ${projectNameContainer}`}>
                    <Paper>
                        <TextField
                            className={projectName}
                            label="Case Name"
                            name="projectName"
                            value={this.props.projectCreation.projectName}
                            onChange={this.handleProjectNameChange}
                        />
                    </Paper>
                </div>
            )
        } else if (this.state.activeStep === 1) {
            const value = this.formatDateForPicker(new Date());
            return (
                <div className={`${stepperContent} ${projectNameContainer}`}>
                    <Paper>
                        <TextField
                            className={projectName}
                            id="date"
                            type="date"
                            value={value}
                            label="Case Delivery Date"
                            name="caseDeadline"
                            onChange={this.handleChange}
                        />
                    </Paper>
                </div>
            );
        } else if (this.state.activeStep === 2) {

            return (
                <div className={`${stepperContent} ${usersContainer}`}>
                    <Paper className={paper}>
                        <div className={projectNotesContainer}>
                            <TextField
                                className={projectNotesInput}
                                multiline={true}
                                label="Case Notes"
                                name="projectNotes"
                                value={this.state.projectNotes}
                                onChange={this.handleChange}
                            />
                        </div>
                    </Paper>
                </div>
            )
        }
    }
}

const mapStateToProps = ({ projectCreation }: IAppState) => ({
    projectCreation,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateProjectName: (projectName: string) => {
        const projectNameUpdateAction = setProjectNameCreator(projectName);
        dispatch(projectNameUpdateAction);
    },
    getInitialProjectCreationCheckpoints: () => {
        dispatch(getInitialCheckpoints as any);
    },
    addProjectUser: (projectUser: IProjectCreationProjectUser) => {
        const projectUserAction = addProjectUserActionCreator(projectUser);
        dispatch(projectUserAction);
    },
    updateProjectUser: (projectUser: IProjectCreationProjectUser, index: number) => {
        const updateProjectUserAction = updateProjectUserActionCreator(projectUser, index);
        dispatch(updateProjectUserAction);
    },
    deleteProjectUser: (index: number) => {
        const deleteProjectUserAction = deleteProjectUserActionCreator(index);
        dispatch(deleteProjectUserAction);
    }
})

export const connectedProjectCreation = connect(mapStateToProps, mapDispatchToProps)(ProjectCreationPresentation as any);
export const ProjectCreation = withRouter((withTheme()(connectedProjectCreation as any)) as any);