import { FormControl, FormHelperText, Input, InputLabel, withTheme } from '@material-ui/core';
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
import * as _ from 'lodash';
import { DateFormatInput } from 'material-ui-next-pickers';
import * as React from 'react';
import { withRouter } from 'react-router';
import { FormControlState } from 'src/Classes/formControlState';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { requiredValidator } from 'src/Validators/required.validator';
import Api from '../../Api/api';
import { ICheckpoint } from '../../Models/checkpoint';
import { createProjectPresentationClasses, IProjectPresentationProps, IProjectPresentationState } from './Project.ias';

class ProjectPresentation extends React.Component<IProjectPresentationProps, IProjectPresentationState> {
    public state: IProjectPresentationState = {
        checkpoints: null,
        projectInformationIsLoading: true,
        caseName: new FormControlState({
            value: '',
            validators: [
                requiredValidator('A case name is required'),
            ],
        }),
        caseDeadline: new FormControlState({
            value: new Date(),
            validators: [
                requiredValidator('The case deadline is required'),
            ],
        }),
        notes: new FormControlState({
            value: '',
        }),
        attachmentUrls: [],
        open: false,
        caseId: '',
        updateCaseInformationInProgress: false,
    }

    constructor(props: IProjectPresentationProps) {
        super(props);
    }

    public async componentWillMount(): Promise<void> {
        const caseId = this.props.match.params['projectId'];
        const companyId = this.props.location.pathname.split('/')[2];

        const project = await Api.projectsApi.getProject(caseId);

        const caseNameControl = this.state.caseName.setValue(project.name);
        const caseDeadlineAsDate = new Date(project.deadline);
        const caseDeadlineControl = this.state.caseDeadline.setValue(caseDeadlineAsDate);
        const notesControl = this.state.notes.setValue(project.notes);

        this.setState({
            attachmentUrls: project.attachmentUrls,
            caseName: caseNameControl,
            caseDeadline: caseDeadlineControl,
            notes: notesControl,
            projectInformationIsLoading: false,
            caseId: project.id,
        });

        const checkpoints = await Api.projectsApi.getProjectCheckpoints({
            caseId,
            companyId,
        });

        this.setState({
            checkpoints,
        })
    }

    public render() {
        if (this.state.projectInformationIsLoading) {
            return <div>Loading</div>
        }

        const {
            attachmentButtonsContainer,
            projectContainer,
            evenPaper,
            secondPaper,
            fieldSpacing,
            halfWidthProjectContainer,
            seeAttachmentsButton,
            workflowToolbar,
            qrCodeButtonContainer,
            addAttachmentButton,
            addAttachmentInput,
            qrCodeButton,
            caseInformationToolbar,
        } = createProjectPresentationClasses(this.props, this.state, this.props.theme);

        // tslint:disable-next-line:no-console
        console.log(this.state.checkpoints);
        const mappedCheckpoints = this.state.checkpoints ? (
            this.state.checkpoints!.map((checkpoint: ICheckpoint, index: number) => (
                <TableRow key={index}>
                    <TableCell>{checkpoint.name}</TableCell>
                    <TableCell>{checkpoint.estimatedCompletionTime}</TableCell>
                    <TableCell>{checkpoint.complete ? (
                        <DoneIcon/>
                    ) : undefined}</TableCell>
                </TableRow>
            )
        )) : <div/>;

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
                                {this.state.checkpoints ? (
                                    <TableBody>
                                        {mappedCheckpoints}
                                    </TableBody>
                                ) : undefined}
                            </Table>
                        </div>
                        <div className={attachmentButtonsContainer}>
                            <Button

                                className={seeAttachmentsButton}
                                color="secondary">
                                See Attachments ({this.state.attachmentUrls.length})
                            </Button>
                            <Button
                                className={addAttachmentButton}
                                color="secondary"
                                variant="contained"
                            >
                                <input
                                    type="file"
                                    className={addAttachmentInput}
                                    onChange={this.handleFileSelection}
                                />
                                Add An Attachment
                            </Button>
                        </div>
                    </Paper>
                </div>
                <div className={halfWidthProjectContainer}>
                    <Paper className={evenPaper}>
                        <div>
                            <Toolbar className={caseInformationToolbar}>
                                <Typography variant="title">
                                    Case Information
                                </Typography>
                                <Button
                                    className={qrCodeButton}
                                    onClick={this.showQrCodeDialog}
                                    color="secondary">
                                    Print QR Code
                                </Button>
                            </Toolbar>
                            <FormControl fullWidth={true} error={this.state.caseName.shouldShowError()}>
                                <InputLabel>Case Name</InputLabel>
                                <Input
                                    name="projectName"
                                    value={this.state.caseName.value}
                                    onChange={this.handleCaseNameChange}
                                />
                                <FormHelperText>
                                    {this.state.caseName.shouldShowError() ? this.state.caseName.errors[0] : undefined}
                                </FormHelperText>
                            </FormControl>
                            <DateFormatInput
                                fullWidth={true}
                                label="Case Delivery Date"
                                className={fieldSpacing}
                                name="caseDeadline"
                                value={this.state.caseDeadline.value}
                                onChange={this.handleCaseDeadlineChange}
                                min={new Date()}
                                error={this.state.caseDeadline.shouldShowError() ? this.state.caseDeadline.errors[0] : undefined}
                            />
                            <TextField
                                fullWidth={true}
                                multiline={true}
                                label="Case Notes"
                                name="projectNotes"
                                value={this.state.notes.value}
                                onChange={this.handleNotesChange}
                            />
                        </div>
                        <div className={qrCodeButtonContainer}>
                            <AsyncButton
                                asyncActionInProgress={this.state.updateCaseInformationInProgress}
                                disabled={this.state.updateCaseInformationInProgress || this.atLeastOneControlIsInvalid()}
                                color="secondary"
                                variant="contained"
                                onClick={this.updateProject}
                            >
                                Update Project Information
                            </AsyncButton>
                        </div>
                    </Paper>
                </div>
            </div>
        );
    }

    private atLeastOneControlIsInvalid = (): boolean => {
        return this.state.caseName.invalid || this.state.caseDeadline.invalid || this.state.notes.invalid;
    }

    private handleFileSelection = async(event: any): Promise<void> => {
        const file = event.target.files[0];
        const companyName = this.props.match.path.split('/')[2];
        const projectId = this.props.match.params['projectId'];

        const uploadTaskSnapshot = await Api.projectsApi.uploadFile(companyName, projectId, file);

        const fullPath = uploadTaskSnapshot.metadata.fullPath;
        const attachmentUrls = _.cloneDeep(this.state.attachmentUrls);
        if (fullPath) {
            attachmentUrls.push(fullPath);
        }
        this.setState({
            attachmentUrls,
        })
    }

    private showQrCodeDialog = (): void => {
        this.setState({
            open: true,
        })
    }

    private updateProject = async(): Promise<void> => {
        this.setState({
            updateCaseInformationInProgress: true,
        })

        await Api.projectsApi.updateCaseInformation(this.state.caseId, {
            name: this.state.caseName.value,
            deadline: this.state.caseDeadline.value.toUTCString(),
            notes: this.state.notes.value,
        })

        this.setState({
            updateCaseInformationInProgress: false,
        })
    }

    private handleCaseDeadlineChange = (newCaseDeadline: Date): void => {
        const updatedCaseDeadlineControl = this.state.caseDeadline.setValue(newCaseDeadline);
        this.setState({
            caseDeadline: updatedCaseDeadlineControl,
        });
    }

    private handleCaseNameChange = (event: any): void => {
        const newCaseName = event.target.value;
        const updatedCaseNameControl = this.state.caseName.setValue(newCaseName);
        this.setState({
            caseName: updatedCaseNameControl,
        })
    }

    private handleNotesChange = (event: any): void => {
        const newCaseNotes = event.target.value;
        const updatedCaseNotesControl = this.state.notes.setValue(newCaseNotes);
        this.setState({
            notes: updatedCaseNotesControl,
        })
    }
}

export const Project = withRouter(withTheme()(ProjectPresentation));