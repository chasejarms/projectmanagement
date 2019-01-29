import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    MenuItem,
    MenuList,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    withTheme,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import DocumentIcon from '@material-ui/icons/Description';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import {DateFormatInput} from 'material-ui-next-pickers'
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import Api from '../../Api/api';
import { ICaseCreateRequest } from '../../Api/Projects/projectsInterface';
import { FormControlState } from '../../Classes/formControlState';
import { ICase } from '../../Models/case';
import { IProjectCreationProjectUser } from '../../Models/projectUser';
import { IUser } from '../../Models/user';
import { addProjectUserActionCreator, resetProjectCreation } from '../../Redux/ActionCreators/projectCreationActionCreators';
import { deleteProjectUserActionCreator, getInitialCheckpoints, setCaseNameCreator, updateProjectUserActionCreator } from '../../Redux/ActionCreators/projectCreationActionCreators';
import { IAppState } from '../../Redux/Reducers/rootReducer';
import { handleChange } from '../../Utils/handleChange';
import { doctorRequiredValidator } from '../../Validators/doctorRequired.validator';
import { requiredValidator } from '../../Validators/required.validator';
import {
    createProjectCreationClasses,
    IProjectCreationProps,
    IProjectCreationState,
} from './ProjectCreation.ias';

export class ProjectCreationPresentation extends React.Component<IProjectCreationProps, IProjectCreationState> {
    public myRef: React.RefObject<{}>;
    public state: IProjectCreationState = {
        open: false,
        activeStep: 0,
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
        doctorSelection: new FormControlState({
            value: {
                id: '',
                name: '',
            },
            validators: [
                doctorRequiredValidator('A doctor is required'),
            ],
        }).markAsInvalid(),
        projectNotes: '',
        doctorNameSearch: '',
        potentialDoctors: [] as IUser[],
        createProjectInProgress: false,
        attachmentUrls: [],
        uniqueCaseId: '',
        uploadingAttachmentInProgress: false,
        srcUrls: [],
        filePath: '',
        dialogError: '',
        dialogIsOpen: false,
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
        const uniqueCaseId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.setState({
            uniqueCaseId,
        })

        const companyId = this.props.match.path.split('/')[2];
        Api.caseNotesApi.getCaseNotes(companyId).then((caseNotes) => {
            this.setState({
                projectNotes: caseNotes,
            });
        });
    }

    public componentWillUnmount = (): void => {
        this.props.resetProjectCreation();
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
            doctorSelection,
        } = this.state;

        const companyId = this.props.match.path.split('/')[2];
        const doctorIsUser = this.props.userState[companyId].type === 'Customer';

        if (this.state.activeStep === 0) {
            return !caseName.invalid;
        } else if (this.state.activeStep === 1 && !doctorIsUser) {
            return !doctorSelection.invalid;
        } else if ((this.state.activeStep === 1 && doctorIsUser) || (this.state.activeStep === 2 && !doctorIsUser)) {
            return !caseDeadline.invalid;
        } else {
            return true;
        }
    }

    private createProject = async() => {
        const companyId = this.props.match.path.split('/')[2];

        const projectCreateRequest: ICaseCreateRequest = {
            name: this.props.projectCreation.caseName.value,
            deadline: this.state.caseDeadline.value.toUTCString(),
            notes: this.state.projectNotes,
            attachmentUrls: this.state.attachmentUrls,
            companyId,
            idForCase: this.state.uniqueCaseId,
        };

        if (this.state.doctorSelection.value.id) {
            projectCreateRequest['doctor'] = this.state.doctorSelection.value.id;
        }

        // tslint:disable-next-line:no-console
        console.log('projectCreateRequest: ', projectCreateRequest);

        this.setState({
            createProjectInProgress: true,
        })

        try {
            await Api.projectsApi.createProject(companyId, projectCreateRequest).then((project: ICase) => {
                this.props.history.push(`/company/${companyId}/project/${project.id}`);
            });
        } catch {
            this.setState({
                createProjectInProgress: false,
            })
        }
    }

    private createActionButtons(): any {
        const companyId = this.props.match.path.split('/')[2];

        const {
            actionButtonContainer,
            baseActionButton,
            asyncActionButton,
        } = createProjectCreationClasses(this.props, this.state);

        const backButton = this.state.activeStep !== 0 ? (
            <Button
                disabled={this.state.createProjectInProgress}
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
                disabled={!this.previousStepsAreValid() || this.state.createProjectInProgress}>
                Next
            </Button>
        ) : undefined;

        const saveButton = this.state.activeStep === lastActiveStep ? (
            <div className={asyncActionButton}>
                 <AsyncButton
                    asyncActionInProgress={this.state.createProjectInProgress}
                    disabled={this.state.createProjectInProgress || this.state.uploadingAttachmentInProgress}
                    variant="contained"
                    onClick={this.createProject}
                    color="secondary">
                    Create Project
                </AsyncButton>
            </div>
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

    private handleDoctorNameSearchChange = async(event: any) => {
        const companyId = this.props.match.path.split('/')[2];

        const searchString = event.target.value;
        this.setState({
            doctorNameSearch: searchString,
        })

        const potentialDoctors = await Api.userApi.searchDoctorUsers(companyId, searchString);

        this.setState({
            potentialDoctors,
        })
    }

    private selectDoctor = (doctor: IUser) => () => {
        const updatedSelectedDoctor = this.state.doctorSelection.setValue({
            id: doctor.id,
            name: doctor.fullName,
        });

        this.setState({
            doctorSelection: updatedSelectedDoctor,
        })
    };

    private handleFileSelection = async (event: any): Promise<void> => {
        // tslint:disable-next-line:no-console
        console.log('event: ', event);
        if (event.target.files.length < 1) {
            return;
        }
        const file = event.target.files[0];
        const companyId = this.props.match.path.split('/')[2];

        const fileNameAlreadyExists = this.state.attachmentUrls.filter((attachmentUrl) => {
            const attachmentUrlPieces = attachmentUrl.path.split('/');
            const compareFileName = attachmentUrlPieces[attachmentUrlPieces.length -1];
            return compareFileName === file.name;
        }).length > 0;

        if (fileNameAlreadyExists) {
            this.setState({
                dialogIsOpen: true,
                dialogError: 'A file with that name has already been uploaded.',
            });
            return;
        }

        const fileIsLargerThan5MB = file.size > (5 * 1000000);
        if (fileIsLargerThan5MB) {
            this.setState({
                dialogIsOpen: true,
                dialogError: 'The maximum file size is 5MB.',
            });
            return;
        }

        this.setState({
            uploadingAttachmentInProgress: true,
            filePath: '',
        })

        const uploadTaskSnapshot = await Api.projectsApi.uploadFile(companyId, this.state.uniqueCaseId, file);

        // tslint:disable-next-line:no-console
        console.log(uploadTaskSnapshot);

        const path = uploadTaskSnapshot.metadata.fullPath;
        const contentType = uploadTaskSnapshot.metadata.contentType as string;
        const attachmentUrls = _.cloneDeep(this.state.attachmentUrls);
        if (path) {
            attachmentUrls.push({
                path,
                contentType,
            });
        }

        if (contentType.startsWith('image/')) {
            const storageRef = await firebase.storage().ref();
            const [
                companyIdInFile,
                caseIdInFile,
                ...actualFileName
            ] = attachmentUrls[attachmentUrls.length - 1].path.split('/');

            const fileNameWithoutSeparation = actualFileName.join('');
            const spaceRef = await storageRef.child(`${companyIdInFile}/${caseIdInFile}/thumb@512_${fileNameWithoutSeparation}`);
            let attempts: number = 0;
            let downloadUrl: any;
            while (attempts < 15) {
                try {
                    downloadUrl = await spaceRef.getDownloadURL();
                    const srcUrlsClone = _.cloneDeep(this.state.srcUrls);

                    this.setState({
                        attachmentUrls,
                        uploadingAttachmentInProgress: false,
                        srcUrls: srcUrlsClone.concat([downloadUrl]),
                    })
                    return;
                } catch (e) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    attempts += 1;
                }
            }

            this.setState({
                attachmentUrls,
                uploadingAttachmentInProgress: false,
            })
        } else {
            const srcUrlsClone = _.cloneDeep(this.state.srcUrls);
            srcUrlsClone.push(`contentType:${contentType}`)
            this.setState({
                attachmentUrls,
                srcUrls: srcUrlsClone,
                uploadingAttachmentInProgress: false,
            })
        }
    }

    private removeImage = (path: string, index: number) => async() => {
        const attachmentUrls = this.state.attachmentUrls.filter((val, compareIndex) => compareIndex !== index);
        const srcUrls = this.state.srcUrls.filter((val, compareIndex) => compareIndex !== index);
        this.setState({
            attachmentUrls,
            srcUrls,
        })

        await Api.projectsApi.removeFile(path);
    }

    private closeErrorDialog = () => {
        this.setState({
            dialogIsOpen: false,
            dialogError: '',
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
            caseDoctorContainer,
            potentialDoctorPaper,
            menuPopover,
            addAttachmentButton,
            addAttachmentInput,
            imgContainer,
            img,
            imagePaper,
            iconContainer,
            documentIcon,
            documentFilePath,
            documentFilePathContainer,
            cancelIconContainer,
            cancelIcon,
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
            return (
                <div className={`${stepperContent} ${projectNameContainer} ${caseDoctorContainer}`}>
                    <Paper>
                        <FormControl className={projectName}>
                            <InputLabel>Search Doctors</InputLabel>
                            <Input
                                name="doctorNameSearch"
                                value={this.state.doctorNameSearch}
                                onChange={this.handleDoctorNameSearchChange}
                            />
                        </FormControl>
                    </Paper>
                    <Paper className={potentialDoctorPaper}>
                        <FormControl className={projectName} disabled={true}>
                            <InputLabel>Selected Doctor</InputLabel>
                            <Input
                                name="selectedDoctor"
                                value={this.state.doctorSelection.value.name}
                            />
                        </FormControl>
                        {this.state.doctorNameSearch && this.state.potentialDoctors.length ? (
                            <Paper className={menuPopover}>
                                <MenuList>
                                    {this.state.potentialDoctors.map((potentialDoctor) => {
                                        return (
                                            <MenuItem key={potentialDoctor.id} onClick={this.selectDoctor(potentialDoctor)}>
                                                {potentialDoctor.fullName} - {potentialDoctor.email}
                                            </MenuItem>
                                        )
                                    })}
                                </MenuList>
                            </Paper>
                        ) : undefined}
                    </Paper>
                </div>
            );
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
                            <AsyncButton
                                disabled={this.state.createProjectInProgress || this.state.uploadingAttachmentInProgress}
                                asyncActionInProgress={this.state.uploadingAttachmentInProgress}
                                color="secondary"
                                variant="contained"
                                className={addAttachmentButton}
                            >
                                <input
                                    type="file"
                                    onChange={this.handleFileSelection}
                                    value={this.state.filePath}
                                    className={addAttachmentInput}
                                />
                                Add An Attachment
                            </AsyncButton>
                        </div>
                        {this.state.srcUrls.length > 0 ? (
                            <div className={imgContainer}>
                                {this.state.srcUrls.map((src, index) => {
                                    const originalImagePathArray = this.state.attachmentUrls[index].path.split('/')
                                    const originalImagePath = originalImagePathArray[originalImagePathArray.length - 1];
                                    return (
                                        <Paper key={index} className={imagePaper}>
                                            {src.startsWith('contentType:') ? (
                                                <div className={iconContainer}>
                                                    <DocumentIcon className={documentIcon} color="secondary"/>
                                                    <div className={documentFilePathContainer}>
                                                        <Typography variant="body1" className={documentFilePath}>{originalImagePath}</Typography>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img src={src} className={img}/>
                                            )}
                                            <div className={cancelIconContainer} onClick={this.removeImage(this.state.attachmentUrls[index].path, index)}>
                                                <CancelIcon className={cancelIcon} color="secondary"/>
                                            </div>
                                        </Paper>
                                    )
                                })}
                            </div>
                        ) : undefined}
                    </Paper>
                    <Dialog
                        open={this.state.dialogIsOpen}
                    >
                        <DialogTitle>Error Uploading File</DialogTitle>
                        <DialogContent>{this.state.dialogError}</DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeErrorDialog}>
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
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