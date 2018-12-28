import {
    Button,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    withTheme,
} from '@material-ui/core';
import {DateFormatInput} from 'material-ui-next-pickers'
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';
import Api from '../../Api/api';
import { ICaseCreateRequest } from '../../Api/Projects/projectsInterface';
import { ICase } from '../../Models/case';
import { IProjectCreationProjectUser } from '../../Models/projectUser';
import { addProjectUserActionCreator } from '../../Redux/ActionCreators/projectCreationActionCreators';
import { deleteProjectUserActionCreator, getInitialCheckpoints, setCaseNameCreator, updateProjectUserActionCreator } from '../../Redux/ActionCreators/projectCreationActionCreators';
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

    public componentWillMount = (): void => {
        const companyName = this.props.match.path.split('/')[2];
        Api.caseNotesApi.getCaseNotes(companyName).then((caseNotes) => {
            this.setState({
                projectNotes: caseNotes,
            });
        });
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
        const companyName = this.props.match.path.split('/')[2];

        // tslint:disable-next-line:no-console
        console.log('caseDeadline :', this.state.caseDeadline);

        const projectCreateRequest: ICaseCreateRequest = {
            name: this.props.projectCreation.caseName,
            deadline: this.state.caseDeadline.toUTCString(),
            notes: this.state.projectNotes,
            companyName,
        };
        Api.projectsApi.createProject(companyName, projectCreateRequest).then((project: ICase) => {
            this.props.history.push(`/company/${companyName}/project/${project.id}`);
        });
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

    private handleCaseDeadlineChange = (newCaseDeadline: Date): void => {
        this.setState({
            caseDeadline: newCaseDeadline,
        })
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
            addAttachmentButtonContainer,
        } = createProjectCreationClasses(this.props, this.state);

        if (this.state.activeStep === 0) {
            return (
                <div className={`${stepperContent} ${projectNameContainer}`}>
                    <Paper>
                        <TextField
                            className={projectName}
                            label="Case Name"
                            name="projectName"
                            value={this.props.projectCreation.caseName}
                            onChange={this.handleProjectNameChange}
                        />
                    </Paper>
                </div>
            )
        } else if (this.state.activeStep === 1) {
            return (
                <div className={`${stepperContent} ${projectNameContainer}`}>
                    <Paper>
                        <DateFormatInput
                            fullWidth={true}
                            label="Case Delivery Date"
                            className={projectName}
                            name="caseDeadline"
                            value={this.state.caseDeadline}
                            onChange={this.handleCaseDeadlineChange}
                            min={new Date()}
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
                        <div className={addAttachmentButtonContainer}>
                            <Button
                                variant="contained"
                                color="secondary">
                                Add An Attachment
                            </Button>
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
        const projectNameUpdateAction = setCaseNameCreator(projectName);
        dispatch(projectNameUpdateAction);
    },
    getInitialProjectCreationCheckpoints: (companyName: string) => {
        const fetchInitialCheckpoints = getInitialCheckpoints(companyName);
        dispatch(fetchInitialCheckpoints as any);
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