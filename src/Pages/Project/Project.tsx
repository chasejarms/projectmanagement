import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Input, InputLabel, withTheme } from '@material-ui/core';
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
import CancelIcon from '@material-ui/icons/CancelOutlined';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import DocumentIcon from '@material-ui/icons/Description';
import DoneIcon from '@material-ui/icons/Done';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { cloneDeep } from 'lodash';
import { DateFormatInput } from 'material-ui-next-pickers';
import * as React from 'react';
import { withRouter } from 'react-router';
import { FormControlState } from 'src/Classes/formControlState';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { QRCodeDisplay } from 'src/Components/QRCodeDisplay/QRCodeDisplay';
import { IAttachmentMetadata } from 'src/Models/attachmentMetadata';
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
        addAttachmentInProgress: false,
        filePath: '',
        dialogIsOpen: false,
        dialogError: '',
        srcUrls: [],
        indexOfHoveredItem: null,
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
        // tslint:disable-next-line:no-console
        console.log(project.attachmentUrls);
        this.createSrcUrls(project.attachmentUrls);

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
        const {
            // attachmentButtonsContainer,
            projectContainer,
            evenPaper,
            secondPaper,
            fieldSpacing,
            // seeAttachmentsButton,
            workflowToolbar,
            qrCodeButtonContainer,
            addAttachmentButton,
            addAttachmentInput,
            qrCodeButton,
            caseInformationToolbar,
            progressAndInformationContainer,
            attachmentsContainer,
            imgContainer,
            imagePaper,
            cancelIconContainer,
            iconContainer,
            documentIcon,
            documentFilePathContainer,
            documentFilePath,
            img,
            cancelIcon,
            attachmentToolbar,
            downloadIconContainer,
            downloadIcon,
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
                <div className={progressAndInformationContainer}>
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
                        {/* <div className={attachmentButtonsContainer}>
                            { this.state.attachmentUrls.length > 0 ? (
                                <Button
                                    disabled={this.state.projectInformationIsLoading}
                                    className={seeAttachmentsButton}
                                    color="secondary">
                                    See Attachments ({this.state.attachmentUrls.length})
                                </Button>
                            ) : undefined}
                        </div> */}
                    </Paper>
                    <Paper className={evenPaper}>
                        <div>
                            <Toolbar className={caseInformationToolbar}>
                                <Typography variant="title">
                                    Case Information
                                </Typography>
                                <Button
                                    disabled={this.state.projectInformationIsLoading}
                                    className={qrCodeButton}
                                    onClick={this.showQrCodeDialog}
                                    color="secondary">
                                    Print QR Code
                                </Button>
                            </Toolbar>
                            <FormControl fullWidth={true} error={this.state.caseName.shouldShowError()} disabled={this.state.projectInformationIsLoading}>
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
                                disabled={this.state.projectInformationIsLoading}
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
                                disabled={this.state.projectInformationIsLoading}
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
                                disabled={this.state.updateCaseInformationInProgress || this.atLeastOneControlIsInvalid() || this.state.addAttachmentInProgress || this.state.projectInformationIsLoading}
                                color="secondary"
                                variant="contained"
                                onClick={this.updateProject}
                            >
                                Update Project Information
                            </AsyncButton>
                        </div>
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
                <QRCodeDisplay
                    qrCodes={[
                        {
                            caseId: this.state.caseId,
                            caseDeadline: this.prettyPrintDate(this.state.caseDeadline.value),
                            caseName: this.state.caseName.value,
                        }
                    ]}
                />
                {this.state.srcUrls.length > 0 ? (
                    <div className={attachmentsContainer}>
                        <Paper>
                            <Toolbar className={attachmentToolbar}>
                                <Typography variant="title">
                                    Attachments
                                </Typography>
                                <AsyncButton
                                    disabled={this.state.addAttachmentInProgress || this.state.projectInformationIsLoading}
                                    asyncActionInProgress={this.state.addAttachmentInProgress}
                                    className={addAttachmentButton}
                                    color="secondary"
                                >
                                    <input
                                        type="file"
                                        className={addAttachmentInput}
                                        value={this.state.filePath}
                                        onChange={this.handleFileSelection}
                                    />
                                    Add An Attachment
                                </AsyncButton>
                            </Toolbar>
                            <div className={imgContainer}>
                                    {this.state.srcUrls.map((src, index) => {
                                        const originalImagePathArray = this.state.attachmentUrls[index].path.split('/')
                                        const originalImagePath = originalImagePathArray[originalImagePathArray.length - 1];
                                        return (
                                            <Paper key={index} className={imagePaper} onMouseEnter={this.setHoverItem(index)} onMouseLeave={this.removeHoverItem}>
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
                                                {this.state.indexOfHoveredItem === index ? (
                                                    <div className={downloadIconContainer} onClick={this.downloadImage(this.state.attachmentUrls[index].path)}>
                                                        <DownloadIcon className={downloadIcon} color="secondary"/>
                                                    </div>
                                                ): undefined}
                                                {this.state.indexOfHoveredItem === index ? (
                                                    <div className={cancelIconContainer} onClick={this.removeImage(this.state.attachmentUrls[index].path, index)}>
                                                        <CancelIcon className={cancelIcon} color="secondary"/>
                                                    </div>
                                                ) : undefined}
                                            </Paper>
                                        )
                                    })}
                            </div>
                        </Paper>
                    </div>
                ) : undefined}
            </div>
        );
    }

    private prettyPrintDate = (date: Date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    }

    private downloadImage = (path: string) => async() => {
        const storage = firebase.storage();

        const downloadUrl = await storage.ref(path).getDownloadURL() as string;

        // tslint:disable-next-line:no-console
        console.log('getting download url');


        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr.response);
            const fileNameSplit = path.split('/');
            const originalFileName = fileNameSplit[fileNameSplit.length - 1];
            a.download = originalFileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
        };
        // tslint:disable-next-line:no-console
        console.log('downloadUrl: ', downloadUrl);
        xhr.open('GET', downloadUrl);
        xhr.send();
    }

    private setHoverItem = (index: number) => () => {
        this.setState({
            indexOfHoveredItem: index,
        })
    }

    private removeHoverItem = () => {
        this.setState({
            indexOfHoveredItem: null,
        })
    }

    private createSrcUrls = async(attachmentsMetadata: IAttachmentMetadata[]) => {
        const storageRef = await firebase.storage().ref();
        const downloadURLPromises = attachmentsMetadata.map((attachmentMetadata) => {
            const path = attachmentMetadata.path;
            const contentType = attachmentMetadata.contentType;

            if (contentType.startsWith('image/')) {
                const [
                    companyIdInFile,
                    caseIdInFile,
                    ...actualFileName
                ] = path.split('/');

                const fileNameWithoutSeparation = actualFileName.join('');
                return storageRef.child(`${companyIdInFile}/${caseIdInFile}/thumb@512_${fileNameWithoutSeparation}`).getDownloadURL();
            } else {
                return Promise.resolve(`contentType:${contentType}`);
            }
        });

        const downloadUrls = await Promise.all(downloadURLPromises);
        this.setState({
            srcUrls: downloadUrls,
        })
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

    private atLeastOneControlIsInvalid = (): boolean => {
        return this.state.caseName.invalid || this.state.caseDeadline.invalid || this.state.notes.invalid;
    }

    private closeErrorDialog = () => {
        this.setState({
            dialogError: '',
            dialogIsOpen: false,
        })
    }

    private handleFileSelection = async(event: any): Promise<void> => {
        // tslint:disable-next-line:no-console
        console.log('event: ', event);
        if (event.target.files.length < 1) {
            return;
        }
        const file = event.target.files[0];
        const companyId = this.props.match.path.split('/')[2];
        const projectId = this.props.match.params['projectId'];

        const fileNameAlreadyExists = this.state.attachmentUrls.filter((attachmentUrl) => {
            // tslint:disable-next-line:no-console
            console.log(attachmentUrl);
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
            addAttachmentInProgress: true,
            filePath: '',
        })

        const uploadTaskSnapshot = await Api.projectsApi.uploadFile(companyId, projectId, file);

        // tslint:disable-next-line:no-console
        console.log(uploadTaskSnapshot);

        const path = uploadTaskSnapshot.metadata.fullPath;
        const contentType = uploadTaskSnapshot.metadata.contentType as string;
        const attachmentUrls = _.cloneDeep(this.state.attachmentUrls);

        const storageRef = await firebase.storage().ref();
        const srcUrlsCopy = cloneDeep(this.state.srcUrls);

        let downloadUrl: string;
        if (contentType.startsWith('image/')) {
            const [
                companyIdInFile,
                caseIdInFile,
                ...actualFileName
            ] = path.split('/');

            const fileNameWithoutSeparation = actualFileName.join('');
            let attempts: number = 0;
            while (attempts < 15) {
                try {
                    downloadUrl = await storageRef.child(`${companyIdInFile}/${caseIdInFile}/thumb@512_${fileNameWithoutSeparation}`).getDownloadURL();
                    if (downloadUrl) {
                        break;
                    }
                } catch (e) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    attempts += 1;
                };
            }
        } else {
            downloadUrl = `contentType:${contentType}`;
        }

        if (path) {
            attachmentUrls.push({
                path,
                contentType,
            });
        }

        // tslint:disable-next-line:no-console
        console.log('setting state');
        this.setState({
            attachmentUrls,
            addAttachmentInProgress: false,
            srcUrls: srcUrlsCopy.concat([downloadUrl!]),
        })
    }

    private showQrCodeDialog = (): void => {
        window.print();
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