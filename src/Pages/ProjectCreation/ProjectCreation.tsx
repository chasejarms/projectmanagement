import {
    Button,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
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
import { FormControlState } from '../../Classes/formControlState';
import { ICase } from '../../Models/case';
import { IProjectCreationProjectUser } from '../../Models/projectUser';
import { addProjectUserActionCreator, resetProjectCreation } from '../../Redux/ActionCreators/projectCreationActionCreators';
import { deleteProjectUserActionCreator, getInitialCheckpoints, setCaseNameCreator, updateProjectUserActionCreator } from '../../Redux/ActionCreators/projectCreationActionCreators';
import { IAppState } from '../../Redux/Reducers/rootReducer';
import { handleChange } from '../../Utils/handleChange';
import { requiredValidator } from '../../Validators/required.validator';
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
        caseName: '',
        checkpoints: [],
        userName: '',
        checkpointStatus: '',
        role: '',
        additionalCheckpoints: new Set<string>([]),
        isUpdate: false,
        index: -1,
        popperIsOpen: true,
        user: {} as any,
        caseDeadline: new FormControlState({
            value: new Date(),
            validators: [
                requiredValidator('A case delivery date is required'),
            ]
        }),
        projectNotes: '',
    };

    public handleChange = handleChange(this);

    constructor(props: IProjectCreationProps) {
        super(props);
        this.myRef = React.createRef();
    }

    public handleCaseNameChange = (event: any) => {
        this.props.resetProjectCreation();
        const caseName = event.target.value;
        const caseNameControl = this.props.projectCreation.caseName.createCopy().setValue(
            caseName,
        )
        this.props.updateCaseName(caseNameControl);
    }

    public componentWillMount = (): void => {

        const companyId = this.props.match.path.split('/')[2];
        Api.caseNotesApi.getCaseNotes(companyId).then((caseNotes) => {
            this.setState({
                projectNotes: caseNotes,
            });
        });
    }

    public render() {
        const companyId = this.props.match.path.split('/')[2];

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
                                { this.props.userState[companyId].type === 'Customer' ? undefined : (
                                    <Step>
                                        <StepLabel>Choose Doctor</StepLabel>
                                    </Step>
                                )}
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

    private previousStepsAreValid = () => {
        const {
            caseName,
        } = this.props.projectCreation;

        const {
            caseDeadline,
        } = this.state;

        if (this.state.activeStep === 0) {
            return !caseName.invalid;
        } else if (this.state.activeStep === 1) {
            return !caseName.invalid && !caseDeadline.invalid;
        } else {
            return true;
        }
    }

    private createProject = () => {
        const companyId = this.props.match.path.split('/')[2];

        const projectCreateRequest: ICaseCreateRequest = {
            name: this.props.projectCreation.caseName.value,
            deadline: this.state.caseDeadline.value.toUTCString(),
            notes: this.state.projectNotes,
            attachmentUrls: [],
        };
        Api.projectsApi.createProject(companyId, projectCreateRequest).then((project: ICase) => {
            this.props.history.push(`/company/${companyId}/project/${project.id}`);
        });
    }

    private createActionButtons(): any {
        const companyId = this.props.match.path.split('/')[2];

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

        const lastActiveStep = this.props.userState[companyId].type === 'Customer' ? 2 : 3;

        const nextButton = this.state.activeStep !== lastActiveStep ? (
            <Button
                className={baseActionButton}
                variant="contained"
                onClick={this.onNextClick}
                color="secondary"
                disabled={!this.previousStepsAreValid()}>
                Next
            </Button>
        ) : undefined;

        const saveButton = this.state.activeStep === lastActiveStep ? (
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
        const newCaseDeadlineControl = this.state.caseDeadline.createCopy().setValue(newCaseDeadline);
        this.setState({
            caseDeadline: newCaseDeadlineControl,
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
            caseDeadline,
        } = createProjectCreationClasses(this.props, this.state);

        const companyId = this.props.match.path.split('/')[2];
        const doctorIsUser = this.props.userState[companyId].type === 'Customer';

        if (this.state.activeStep === 0) {
            const { caseName } = this.props.projectCreation;
            return (
                <div className={`${stepperContent} ${projectNameContainer}`}>
                    <Paper>
                        <FormControl required={true} className={projectName} error={caseName.shouldShowError()}>
                            <InputLabel>Case Name</InputLabel>
                            <Input
                                name="caseName"
                                value={caseName.value}
                                onChange={this.handleCaseNameChange}
                            />
                            <FormHelperText>
                                {caseName.shouldShowError() ? caseName.errors[0] : undefined}
                            </FormHelperText>
                        </FormControl>
                    </Paper>
                </div>
            )
        } else if (this.state.activeStep === 1 && !doctorIsUser) {
            return <div>This is the page where the company will select the doctor</div>
        } else if (this.state.activeStep === 1 && doctorIsUser || this.state.activeStep === 2 && !doctorIsUser) {
            return (
                <div className={`${stepperContent} ${projectNameContainer}`}>
                    <Paper>
                        <DateFormatInput
                            fullWidth={true}
                            label="Case Delivery Date"
                            className={caseDeadline}
                            name="caseDeadline"
                            value={this.state.caseDeadline.value}
                            onChange={this.handleCaseDeadlineChange}
                            min={new Date()}
                            error={this.state.caseDeadline.shouldShowError() ? this.state.caseDeadline.errors[0] : undefined}
                        />
                    </Paper>
                </div>
            );
        } else if (this.state.activeStep === 2 && doctorIsUser || this.state.activeStep === 3 && !doctorIsUser) {

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

const mapStateToProps = ({ projectCreation, userState }: IAppState) => ({
    projectCreation,
    userState,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    resetProjectCreation: () => {
        dispatch(resetProjectCreation);
    },
    updateCaseName: (caseNameControl: FormControlState<string>) => {
        const caseNameUpdateAction = setCaseNameCreator(caseNameControl);
        dispatch(caseNameUpdateAction);
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