import {
    Button,
    Checkbox,
    CircularProgress,
    Paper,
    Snackbar,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Toolbar,
    Tooltip,
    Typography,
    withTheme,
} from "@material-ui/core";
import DoneIcon from '@material-ui/icons/Done';
import * as firebase from 'firebase';
import * as React from "react";
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { AsyncButton } from "src/Components/AsyncButton/AsyncButton";
import { CaseDeadlineEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/CaseDeadlineEdit/CaseDeadlineEdit";
import { CheckboxEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/CheckboxEdit/CheckboxEdit";
import { DateEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/DateEdit/DateEdit";
import { DoctorInformationEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/DoctorInformationEdit/DoctorInformation";
import { DropdownEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/DropdownEdit/DropdownEdit";
import { MultilineTextEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/MultilineTextEdit/MultilineTextEdit";
import { NonEditableText } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/NonEditableText/NonEditableText";
import { NumberEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/NumberEdit/NumberEdit";
import { SingleLineTextEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/SingleLineTextEdit/SingleLineTextEdit";
import { TitleEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/TitleEdit/TitleEdit";
import { QRCodeDisplay } from "src/Components/QRCodeDisplay/QRCodeDisplay";
import { ICheckpoint } from "src/Models/checkpoint";
import { IDoctorUser } from "src/Models/doctorUser";
import { IPrescriptionControlTemplateType } from "src/Models/prescription/controls/prescriptionControlTemplateType";
import { ShowNewInfoFromType } from "src/Models/showNewInfoFromTypes";
import { UserType } from "src/Models/userTypes";
import { setCaseCreationControlValues, updateExistingCaseControlValue } from "src/Redux/ActionCreators/existingCaseActionCreators";
import { IAppState } from "src/Redux/Reducers/rootReducer";
import Api from '../../Api/api';
import {
    createProjectPresentationClasses,
    IProjectPresentationProps,
    IProjectPresentationState,
} from "./Project.ias";

class ProjectPresentation extends React.Component<IProjectPresentationProps, IProjectPresentationState> {
    // tslint:disable-next-line:variable-name
    public _isMounted: boolean = false;

    public state: IProjectPresentationState = {
        tabIndex: 0,
        projectInformationIsLoading: true,
        retrievingCheckpoints: true,
        checkpoints: null,
        loadingPrescriptionTemplate: true,
        prescriptionFormTemplate: null,
        doctorUser: null,
        updateCaseInformationInProgress: false,
        snackbarIsOpen: false,
    };

    public render() {
        const {
            tabIndex,
        } = this.state;

        const {
            // projectContainer,
            // evenPaper,
            // secondPaper,
            // fieldSpacing,
            projectContainer,
            workflowToolbar,
            contentContainer,
            caseProgressPaper,
            tabsContainer,
            // qrCodeButtonContainer,
            // addAttachmentButton,
            // addAttachmentInput,
            // qrCodeButton,
            // caseInformationToolbar,
            // progressAndInformationContainer,
            // attachmentsContainer,
            // imgContainer,
            // imagePaper,
            // cancelIconContainer,
            // iconContainer,
            // documentIcon,
            // documentFilePathContainer,
            // documentFilePath,
            // img,
            // cancelIcon,
            // attachmentToolbar,
            // downloadIconContainer,
            // downloadIcon,
            createCaseButtonContainer,
            prescriptionPaper,
            loadingCheckpointsContainer,
            circularProgressContainer,
            sectionsContainer,
            controlContainer,
            sectionContainer,
            companyLogoImage,
        } = createProjectPresentationClasses(this.props, this.state, this.props.theme);

        const companyId = this.props.location.pathname.split('/')[2];
        const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;
        const mappedCheckpoints = this.state.checkpoints ? (
            this.state.checkpoints!.map((checkpoint: ICheckpoint, index: number) => {
                return (
                    <TableRow key={index}>
                        <TableCell>{checkpoint.name}</TableCell>
                        <TableCell>{checkpoint.estimatedCompletionTime}</TableCell>
                        <TableCell>
                            {userIsDoctor && checkpoint.complete ? (
                                <DoneIcon/>
                            ) : !userIsDoctor ? (
                                <Checkbox
                                    checked={checkpoint.complete}
                                    onChange={this.handleCheckpointChange(checkpoint, index)}
                                    color="primary"
                                />
                            ) : undefined}
                        </TableCell>
                        {!userIsDoctor ? (
                            <TableCell>{checkpoint.completedByName}</TableCell>
                        ) : undefined}
                    </TableRow>
                )
            }
        )) : <div/>;

        const controlValuesExist = Object.keys(this.props.existingCaseState.controlValues).length > 0;
        const dataIsReady = !this.state.loadingPrescriptionTemplate && controlValuesExist;
        const showQRCodeDisplay = this.props.existingCaseState && this.state.prescriptionFormTemplate && this.state.doctorUser;
        const caseId = this.props.match.params['projectId'];

        return (
            <div className={projectContainer}>
                <div className={tabsContainer}>
                    <Tabs value={tabIndex} onChange={this.handleChange}>
                        <Tab label="Prescription"/>
                        <Tab label="Case Progress"/>
                    </Tabs>
                </div>
                <div className={contentContainer}>
                    {tabIndex === 0 && (
                        <Paper className={prescriptionPaper}>
                            {showQRCodeDisplay ? (
                                <QRCodeDisplay
                                    controlValues={this.props.existingCaseState.controlValues}
                                    prescriptionFormTemplate={this.state.prescriptionFormTemplate!}
                                    doctorUser={this.state.doctorUser!}
                                    caseId={caseId}
                                />
                            ) : undefined}
                            {!dataIsReady ? (
                                <div className={circularProgressContainer}>
                                    <CircularProgress
                                        color="primary"
                                        size={64}
                                        thickness={3}
                                    />
                                </div>
                            ) : (
                                <div className={sectionsContainer}>
                                        {this.state.companyLogoDownloadURL ? (
                                            <div>
                                                <img src={this.state.companyLogoDownloadURL} className={companyLogoImage}/>
                                            </div>
                                        ) : undefined}
                                    {this.state.prescriptionFormTemplate!.sectionOrder.map((sectionId, sectionIndex) => {
                                        const sections = this.state.prescriptionFormTemplate!.sections;
                                        const currentSection = sections[sectionId];
                                        const controlOrderForSection = currentSection.controlOrder;
                                        const noControlForSection = controlOrderForSection.length === 0;

                                        if (noControlForSection) {
                                            return undefined;
                                        }

                                        return (
                                            <div key={sectionId} className={sectionContainer}>
                                                {controlOrderForSection.map((controlId) => {
                                                    return (
                                                        <div key={controlId} className={controlContainer}>
                                                            {this.correctControlDisplay(controlId)}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            {!this.state.loadingPrescriptionTemplate ? (
                                <div className={createCaseButtonContainer}>
                                    <Button onClick={this.showQrCodeDialog} color="secondary">
                                        Print Case Information
                                    </Button>
                                    <Tooltip
                                        title="Doctor Information and Case Deadline are required fields"
                                        placement="left"
                                        disableFocusListener={true}
                                        disableHoverListener={true}
                                        disableTouchListener={true}
                                    >
                                        <span>
                                            <AsyncButton
                                                color="secondary"
                                                disabled={this.state.updateCaseInformationInProgress}
                                                asyncActionInProgress={this.state.updateCaseInformationInProgress}
                                                onClick={this.updateCase}>
                                                Update Case
                                            </AsyncButton>
                                        </span>
                                    </Tooltip>
                                </div>
                            ) : undefined}
                        </Paper>
                    )}
                    {tabIndex === 1 && (
                        <Paper className={caseProgressPaper}>
                            {this.state.retrievingCheckpoints ? (
                                <div className={loadingCheckpointsContainer}>
                                    <CircularProgress
                                        color="primary"
                                        size={64}
                                        thickness={3}
                                    />
                                </div>
                            ) : undefined}
                            <div>
                                <Toolbar className={workflowToolbar}>
                                    <Typography variant="title">
                                        Case Progress
                                    </Typography>
                                </Toolbar>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Checkpoint Name</TableCell>
                                            <TableCell>Estimated Completion Time</TableCell>
                                            <TableCell>Complete</TableCell>
                                            {!userIsDoctor ? (
                                                <TableCell>Completed By</TableCell>
                                            ) : undefined}
                                        </TableRow>
                                    </TableHead>
                                    {this.state.checkpoints ? (
                                        <TableBody>
                                            {mappedCheckpoints}
                                        </TableBody>
                                    ) : undefined}
                                </Table>
                            </div>
                        </Paper>
                    )}
                    <Snackbar
                        open={this.state.snackbarIsOpen}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        autoHideDuration={5000}
                        message={
                            (
                                <span>
                                    Success! The case was updated.
                                </span>
                            )
                        }
                        onClose={this.handleSnackbarClose}
                    />
                </div>
            </div>
        )
    }

    public componentWillMount = async(): Promise<void> => {
        this._isMounted = true;
        const caseId = this.props.match.params['projectId'];
        const companyId = this.props.location.pathname.split('/')[2];

        if (this._isMounted) {
            this.setState({
                projectInformationIsLoading: false,
            });
        }

        const [
            prescription,
            checkpoints,
        ] = await Promise.all([
            Api.projectsApi.getProject(caseId),
            Api.projectsApi.getProjectCheckpoints({
                caseId,
                companyId,
            })
        ]);

        const showNewInfoFromDoctor = prescription.showNewInfoFrom === ShowNewInfoFromType.Doctor;
        const showNewInfoFromLab = prescription.showNewInfoFrom === ShowNewInfoFromType.Lab;

        const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;

        const shouldMarkAsShown = (showNewInfoFromDoctor && !userIsDoctor) || (showNewInfoFromLab && userIsDoctor);

        if (shouldMarkAsShown) {
            Api.projectsApi.markProjectUpdatesAsSeen(companyId, caseId);
        }

        const [
            prescriptionFormTemplate,
            user,
        ] = await Promise.all([
            Api.prescriptionTemplateApi.getPrescriptionTemplateById(
                prescription.prescriptionFormTemplateId,
            ),
            Api.userApi.getUser((prescription as any).doctor),
        ]);

        // tslint:disable-next-line:no-console
        console.log('prescriptionFormTemplate: ', prescriptionFormTemplate);

        const doctorUser = user as IDoctorUser;

        if (prescriptionFormTemplate.companyLogoURL) {
            await this.createCompanyLogoDownloadURL(prescriptionFormTemplate.companyLogoURL);
        }

        if (this._isMounted) {
            this.setState({
                checkpoints,
                retrievingCheckpoints: false,
                prescriptionFormTemplate,
                loadingPrescriptionTemplate: false,
                doctorUser,
            })

            this.props.setControlValues(prescription.controlValues);
        }
    }

    private createCompanyLogoDownloadURL = async(companyLogoURL: string) => {
        const storageRef = firebase.storage().ref();
        const companyLogoDownloadURL = await storageRef.child(companyLogoURL).getDownloadURL();

        this.setState({
            companyLogoDownloadURL,
        });
    }

    private handleSnackbarClose = (): void => {
        this.setState({
            snackbarIsOpen: false,
        })
    }

    private updateCase = async() => {
        this.setState({
            updateCaseInformationInProgress: true,
        });

        const caseId = this.props.match.params['projectId'];
        const companyId = this.props.location.pathname.split('/')[2];
        const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;
        const showNewInfoFrom = userIsDoctor ? ShowNewInfoFromType.Doctor : ShowNewInfoFromType.Lab;

        await Api.projectsApi.updateCaseInformation(caseId, {
            controlValues: this.props.existingCaseState!.controlValues,
        }, showNewInfoFrom);

        this.setState({
            updateCaseInformationInProgress: false,
            snackbarIsOpen: true,
        })
    }

    private handleChange = (event: any, tabIndex: number) => {
        this.setState({
            tabIndex,
        })
    }

    private correctControlDisplay = (controlId: string) => {
        const control = this.state.prescriptionFormTemplate!.controls[controlId];
        const controlValue = this.props.existingCaseState.controlValues[control.id]
        const updatingCaseInformation = this.state.updateCaseInformationInProgress;

        if (control.type === IPrescriptionControlTemplateType.Title) {
            return <TitleEdit control={control}/>
        } else if (control.type === IPrescriptionControlTemplateType.Dropdown) {
            return (
                <DropdownEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={updatingCaseInformation}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.DoctorInformation) {
            return (
                <DoctorInformationEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={true}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                    existingDoctorInformation={this.state.doctorUser}
                    hideSearch={true}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.MultilineText) {
            return (
                <MultilineTextEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={updatingCaseInformation}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.SingleLineText) {
            return (
                <SingleLineTextEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={updatingCaseInformation}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.Checkbox) {
            return (
                <CheckboxEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={updatingCaseInformation}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.Number) {
            return (
                <NumberEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={updatingCaseInformation}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.NonEditableText) {
            return (
                <NonEditableText
                    control={control}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.Date) {
            return (
                <DateEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={updatingCaseInformation}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.CaseDeadline) {
            return (
                <CaseDeadlineEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={true}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        }

        return <div/>
    }
    // public state: IProjectPresentationState = {
    //     checkpoints: null,
    //     projectInformationIsLoading: true,
    //     caseName: new FormControlState({
    //         value: '',
    //         validators: [
    //             requiredValidator('A case name is required'),
    //         ],
    //     }),
    //     caseDeadline: new FormControlState({
    //         value: new Date(),
    //         validators: [
    //             requiredValidator('The case deadline is required'),
    //         ],
    //     }),
    //     notes: new FormControlState({
    //         value: '',
    //     }),
    //     attachmentUrls: [],
    //     open: false,
    //     caseId: '',
    //     updateCaseInformationInProgress: false,
    //     addAttachmentInProgress: false,
    //     filePath: '',
    //     dialogIsOpen: false,
    //     dialogError: '',
    //     srcUrls: [],
    //     indexOfHoveredItem: null,
    //     retrievingCheckpoints: true,
    //     projectWasSuccessfullyUpdated: false,
    //     snackbarIsOpen: false,
    // }

    // // tslint:disable-next-line:variable-name
    // public _isMounted: boolean;

    // constructor(props: IProjectPresentationProps) {
    //     super(props);
    // }

    

    // public componentWillUnmount(): void {
    //     this._isMounted = false;
    // }

    // public render() {
    //     const {
    //         projectContainer,
    //         evenPaper,
    //         secondPaper,
    //         fieldSpacing,
    //         workflowToolbar,
    //         qrCodeButtonContainer,
    //         addAttachmentButton,
    //         addAttachmentInput,
    //         qrCodeButton,
    //         caseInformationToolbar,
    //         progressAndInformationContainer,
    //         attachmentsContainer,
    //         imgContainer,
    //         imagePaper,
    //         cancelIconContainer,
    //         iconContainer,
    //         documentIcon,
    //         documentFilePathContainer,
    //         documentFilePath,
    //         img,
    //         cancelIcon,
    //         attachmentToolbar,
    //         downloadIconContainer,
    //         downloadIcon,
    //         loadingCheckpointsContainer,
    //     } = createProjectPresentationClasses(this.props, this.state, this.props.theme);

    //     const companyId = this.props.location.pathname.split('/')[2];
    //     const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;
    //     const mappedCheckpoints = this.state.checkpoints ? (
    //         this.state.checkpoints!.map((checkpoint: ICheckpoint, index: number) => {
    //             return (
    //                 <TableRow key={index}>
    //                     <TableCell>{checkpoint.name}</TableCell>
    //                     <TableCell>{checkpoint.estimatedCompletionTime}</TableCell>
    //                     <TableCell>
    //                         {userIsDoctor && checkpoint.complete ? (
    //                             <DoneIcon/>
    //                         ) : !userIsDoctor ? (
    //                             <Checkbox
    //                                 checked={checkpoint.complete}
    //                                 onChange={this.handleCheckpointChange(checkpoint, index)}
    //                                 color="primary"
    //                             />
    //                         ) : undefined}
    //                     </TableCell>
    //                 </TableRow>
    //             )
    //         }
    //     )) : <div/>;

    //     return (
    //         <div className={projectContainer}>
    //             <div className={progressAndInformationContainer}>
    //                 <Paper className={secondPaper}>
    //                     {this.state.retrievingCheckpoints ? (
    //                         <div className={loadingCheckpointsContainer}>
    //                             <CircularProgress
    //                                 color="primary"
    //                                 size={64}
    //                                 thickness={3}
    //                             />
    //                         </div>
    //                     ) : undefined}
    //                     <div>
    //                         <Toolbar className={workflowToolbar}>
    //                             <Typography variant="title">
    //                                 Case Progress
    //                             </Typography>
    //                             {/* <Tooltip title="Filter list">
    //                                 <IconButton aria-label="Filter list">
    //                                     <FilterListIcon />
    //                                 </IconButton>
    //                             </Tooltip> */}
    //                         </Toolbar>
    //                         <Table>
    //                             <TableHead>
    //                                 <TableRow>
    //                                     <TableCell>Checkpoint Name</TableCell>
    //                                     <TableCell>Estimated Completion Time</TableCell>
    //                                     <TableCell>Complete</TableCell>
    //                                 </TableRow>
    //                             </TableHead>
    //                             {this.state.checkpoints ? (
    //                                 <TableBody>
    //                                     {mappedCheckpoints}
    //                                 </TableBody>
    //                             ) : undefined}
    //                         </Table>
    //                     </div>
    //                 </Paper>
    //                 <Paper className={evenPaper}>
    //                     <div>
    //                         <Toolbar className={caseInformationToolbar}>
    //                             <Typography variant="title">
    //                                 Case Information
    //                             </Typography>
    //                             <Button
    //                                 disabled={this.state.projectInformationIsLoading}
    //                                 className={qrCodeButton}
    //                                 onClick={this.showQrCodeDialog}
    //                                 color="secondary">
    //                                 Print QR Code
    //                             </Button>
    //                         </Toolbar>
    //                         <FormControl fullWidth={true} error={this.state.caseName.shouldShowError()} disabled={this.state.projectInformationIsLoading}>
    //                             <InputLabel>Case Name</InputLabel>
    //                             <Input
    //                                 name="projectName"
    //                                 value={this.state.caseName.value}
    //                                 onChange={this.handleCaseNameChange}
    //                             />
    //                             <FormHelperText>
    //                                 {this.state.caseName.shouldShowError() ? this.state.caseName.errors[0] : undefined}
    //                             </FormHelperText>
    //                         </FormControl>
    //                         <DateFormatInput
    //                             disabled={this.state.projectInformationIsLoading}
    //                             fullWidth={true}
    //                             label="Case Delivery Date"
    //                             className={fieldSpacing}
    //                             name="caseDeadline"
    //                             value={this.state.caseDeadline.value}
    //                             onChange={this.handleCaseDeadlineChange}
    //                             min={new Date()}
    //                             error={this.state.caseDeadline.shouldShowError() ? this.state.caseDeadline.errors[0] : undefined}
    //                         />
    //                         <TextField
    //                             disabled={this.state.projectInformationIsLoading}
    //                             fullWidth={true}
    //                             multiline={true}
    //                             label="Case Notes"
    //                             name="projectNotes"
    //                             value={this.state.notes.value}
    //                             onChange={this.handleNotesChange}
    //                         />
    //                     </div>
    //                     <div className={qrCodeButtonContainer}>
    //                         <AsyncButton
    //                             asyncActionInProgress={this.state.updateCaseInformationInProgress}
    //                             disabled={this.state.updateCaseInformationInProgress || this.atLeastOneControlIsInvalid() || this.state.addAttachmentInProgress || this.state.projectInformationIsLoading}
    //                             color="secondary"
    //                             variant="contained"
    //                             onClick={this.updateProject}
    //                         >
    //                             Update Project Information
    //                         </AsyncButton>
    //                     </div>
    //                 </Paper>
    //                 <Dialog
    //                     open={this.state.dialogIsOpen}
    //                 >
    //                     <DialogTitle>Error Uploading File</DialogTitle>
    //                     <DialogContent>{this.state.dialogError}</DialogContent>
    //                     <DialogActions>
    //                         <Button onClick={this.closeErrorDialog}>
    //                             Close
    //                         </Button>
    //                     </DialogActions>
    //                 </Dialog>
    //             </div>
    //             <QRCodeDisplay
    //                 qrCodes={[
    //                     {
    //                         caseId: this.state.caseId,
    //                         caseDeadline: this.prettyPrintDate(this.state.caseDeadline.value),
    //                         caseName: this.state.caseName.value,
    //                     }
    //                 ]}
    //             />
    //             <div className={attachmentsContainer}>
    //                 <Paper>
    //                     <Toolbar className={attachmentToolbar}>
    //                         <Typography variant="title">
    //                             Attachments
    //                         </Typography>
    //                         <AsyncButton
    //                             disabled={this.state.addAttachmentInProgress || this.state.projectInformationIsLoading}
    //                             asyncActionInProgress={this.state.addAttachmentInProgress}
    //                             className={addAttachmentButton}
    //                             color="secondary"
    //                         >
    //                             <input
    //                                 type="file"
    //                                 className={addAttachmentInput}
    //                                 value={this.state.filePath}
    //                                 onChange={this.handleFileSelection}
    //                             />
    //                             Add An Attachment
    //                         </AsyncButton>
    //                     </Toolbar>
    //                     <div className={imgContainer}>
    //                             {this.state.srcUrls.length > 0 ? undefined : (
    //                                 <Typography>No attachments have been added</Typography>
    //                             )}
    //                             {this.state.srcUrls.map((src, index) => {
    //                                 const originalImagePathArray = this.state.attachmentUrls[index].path.split('/')
    //                                 const originalImagePath = originalImagePathArray[originalImagePathArray.length - 1];
    //                                 return (
    //                                     <Paper key={index} className={imagePaper} onMouseEnter={this.setHoverItem(index)} onMouseLeave={this.removeHoverItem}>
    //                                         {src.startsWith('contentType:') ? (
    //                                             <div className={iconContainer}>
    //                                                 <DocumentIcon className={documentIcon} color="secondary"/>
    //                                                 <div className={documentFilePathContainer}>
    //                                                     <Typography variant="body1" className={documentFilePath}>{originalImagePath}</Typography>
    //                                                 </div>
    //                                             </div>
    //                                         ) : (
    //                                             <img src={src} className={img}/>
    //                                         )}
    //                                         {this.state.indexOfHoveredItem === index ? (
    //                                             <div className={downloadIconContainer} onClick={this.downloadImage(this.state.attachmentUrls[index].path)}>
    //                                                 <DownloadIcon className={downloadIcon} color="secondary"/>
    //                                             </div>
    //                                         ): undefined}
    //                                         {this.state.indexOfHoveredItem === index ? (
    //                                             <div className={cancelIconContainer} onClick={this.removeImage(this.state.attachmentUrls[index].path, index)}>
    //                                                 <CancelIcon className={cancelIcon} color="secondary"/>
    //                                             </div>
    //                                         ) : undefined}
    //                                     </Paper>
    //                                 )
    //                             })}
    //                     </div>
    //                 </Paper>
    //             </div>
    //             <Snackbar
    //                 open={this.state.snackbarIsOpen}
    //                 anchorOrigin={{
    //                     vertical: 'bottom',
    //                     horizontal: 'center',
    //                 }}
    //                 autoHideDuration={5000}
    //                 message={
    //                     (
    //                         <span>
    //                             {this.state.projectWasSuccessfullyUpdated ? (
    //                                 'Success! The project notes were updated.'
    //                             ): (
    //                                 'Oops! It looks like there was an error.'
    //                             )}
    //                         </span>
    //                     )
    //                 }
    //                 onClose={this.handleSnackbarClose}
    //             />
    //         </div>
    //     );
    // }

    // private handleSnackbarClose = (): void => {
    //     this.setState({
    //         snackbarIsOpen: false,
    //     })
    // }

    private handleCheckpointChange = (checkpoint: ICheckpoint, index: number) => async() => {
        const companyId = this.props.location.pathname.split('/')[2];
        const currentUser = this.props.userState[companyId];
        const completedBy = !checkpoint.complete ? currentUser.uid : null;
        const completedByName = !checkpoint.complete ? currentUser.fullName : null;
        const checkpoints = this.state.checkpoints!.map((compareCheckpoint, compareIndex) => {
            if (index === compareIndex) {
                return {
                    ...checkpoint,
                    complete: !compareCheckpoint.complete,
                    completedBy,
                    completedByName,
                }
            } else {
                return compareCheckpoint;
            }
        })

        this.setState({
            checkpoints,
        })

        await Api.projectsApi.updateCaseCheckpoint(checkpoint.id, !checkpoint.complete, completedBy, completedByName);
    }

    // private prettyPrintDate = (date: Date) => {
    //     const day = date.getDate();
    //     const month = date.getMonth() + 1;
    //     const year = date.getFullYear();

    //     return `${month}/${day}/${year}`;
    // }

    // private downloadImage = (path: string) => async() => {
    //     const storage = firebase.storage();

    //     const downloadUrl = await storage.ref(path).getDownloadURL() as string;

    //     // tslint:disable-next-line:no-console
    //     console.log('getting download url');


    //     const xhr = new XMLHttpRequest();
    //     xhr.responseType = 'blob';
    //     xhr.onload = (event) => {
    //         const a = document.createElement('a');
    //         a.href = window.URL.createObjectURL(xhr.response);
    //         const fileNameSplit = path.split('/');
    //         const originalFileName = fileNameSplit[fileNameSplit.length - 1];
    //         a.download = originalFileName;
    //         a.style.display = 'none';
    //         document.body.appendChild(a);
    //         a.click();
    //     };
    //     // tslint:disable-next-line:no-console
    //     console.log('downloadUrl: ', downloadUrl);
    //     xhr.open('GET', downloadUrl);
    //     xhr.send();
    // }

    // private setHoverItem = (index: number) => () => {
    //     this.setState({
    //         indexOfHoveredItem: index,
    //     })
    // }

    // private removeHoverItem = () => {
    //     this.setState({
    //         indexOfHoveredItem: null,
    //     })
    // }

    // private createSrcUrls = async(attachmentsMetadata: IAttachmentMetadata[]) => {
    //     const storageRef = await firebase.storage().ref();
    //     const downloadURLPromises = attachmentsMetadata.map((attachmentMetadata) => {
    //         const path = attachmentMetadata.path;
    //         const contentType = attachmentMetadata.contentType;

    //         if (contentType.startsWith('image/')) {
    //             const [
    //                 companyIdInFile,
    //                 caseIdInFile,
    //                 ...actualFileName
    //             ] = path.split('/');

    //             const fileNameWithoutSeparation = actualFileName.join('');
    //             return storageRef.child(`${companyIdInFile}/${caseIdInFile}/thumb@512_${fileNameWithoutSeparation}`).getDownloadURL();
    //         } else {
    //             return Promise.resolve(`contentType:${contentType}`);
    //         }
    //     });

    //     const downloadUrls = await Promise.all(downloadURLPromises);
    //     if (this._isMounted) {
    //         this.setState({
    //             srcUrls: downloadUrls,
    //         })
    //     }
    // }

    // private removeImage = (path: string, index: number) => async() => {
    //     const attachmentUrls = this.state.attachmentUrls.filter((val, compareIndex) => compareIndex !== index);
    //     const srcUrls = this.state.srcUrls.filter((val, compareIndex) => compareIndex !== index);
    //     this.setState({
    //         attachmentUrls,
    //         srcUrls,
    //     })

    //     await Api.projectsApi.removeFile(path);
    // }

    // private atLeastOneControlIsInvalid = (): boolean => {
    //     return this.state.caseName.invalid || this.state.caseDeadline.invalid || this.state.notes.invalid;
    // }

    // private closeErrorDialog = () => {
    //     this.setState({
    //         dialogError: '',
    //         dialogIsOpen: false,
    //     })
    // }

    // private handleFileSelection = async(event: any): Promise<void> => {
    //     // tslint:disable-next-line:no-console
    //     console.log('event: ', event);
    //     if (event.target.files.length < 1) {
    //         return;
    //     }
    //     const file = event.target.files[0];
    //     const companyId = this.props.match.path.split('/')[2];
    //     const projectId = this.props.match.params['projectId'];

    //     const fileNameAlreadyExists = this.state.attachmentUrls.filter((attachmentUrl) => {
    //         // tslint:disable-next-line:no-console
    //         console.log(attachmentUrl);
    //         const attachmentUrlPieces = attachmentUrl.path.split('/');
    //         const compareFileName = attachmentUrlPieces[attachmentUrlPieces.length -1];
    //         return compareFileName === file.name;
    //     }).length > 0;

    //     if (fileNameAlreadyExists) {
    //         if (this._isMounted) {
    //             this.setState({
    //                 dialogIsOpen: true,
    //                 dialogError: 'A file with that name has already been uploaded.',
    //             });
    //         }
    //         return;
    //     }

    //     const fileIsLargerThan5MB = file.size > (5 * 1000000);
    //     if (fileIsLargerThan5MB) {
    //         this.setState({
    //             dialogIsOpen: true,
    //             dialogError: 'The maximum file size is 5MB.',
    //         });
    //         return;
    //     }

    //     this.setState({
    //         addAttachmentInProgress: true,
    //         filePath: '',
    //     })

    //     const uploadTaskSnapshot = await Api.projectsApi.uploadFile(companyId, projectId, file);

    //     // tslint:disable-next-line:no-console
    //     console.log(uploadTaskSnapshot);

    //     const path = uploadTaskSnapshot.metadata.fullPath;
    //     const contentType = uploadTaskSnapshot.metadata.contentType as string;
    //     const attachmentUrls = _.cloneDeep(this.state.attachmentUrls);

    //     const storageRef = await firebase.storage().ref();
    //     const srcUrlsCopy = cloneDeep(this.state.srcUrls);

    //     let downloadUrl: string;
    //     if (contentType.startsWith('image/')) {
    //         const [
    //             companyIdInFile,
    //             caseIdInFile,
    //             ...actualFileName
    //         ] = path.split('/');

    //         const fileNameWithoutSeparation = actualFileName.join('');
    //         let attempts: number = 0;
    //         while (attempts < 15) {
    //             try {
    //                 downloadUrl = await storageRef.child(`${companyIdInFile}/${caseIdInFile}/thumb@512_${fileNameWithoutSeparation}`).getDownloadURL();
    //                 if (downloadUrl) {
    //                     break;
    //                 }
    //             } catch (e) {
    //                 await new Promise(resolve => setTimeout(resolve, 1000));
    //                 attempts += 1;
    //             };
    //         }
    //     } else {
    //         downloadUrl = `contentType:${contentType}`;
    //     }

    //     if (path) {
    //         attachmentUrls.push({
    //             path,
    //             contentType,
    //         });
    //     }

    //     // tslint:disable-next-line:no-console
    //     console.log('setting state');
    //     if (this._isMounted) {
    //         this.setState({
    //             attachmentUrls,
    //             addAttachmentInProgress: false,
    //             srcUrls: srcUrlsCopy.concat([downloadUrl!]),
    //         })
    //     }
    // }

    private showQrCodeDialog = (): void => {
        window.print();
    }

    // private updateProject = async(): Promise<void> => {
    //     this.setState({
    //         updateCaseInformationInProgress: true,
    //     })

    //     const companyId = this.props.location.pathname.split('/')[2];
    //     const showNewInfoFrom = this.props.userState[companyId].type === UserType.Doctor ? ShowNewInfoFromType.Doctor : ShowNewInfoFromType.Lab;

    //     try {
    //         await Api.projectsApi.updateCaseInformation(this.state.caseId, {
    //             name: this.state.caseName.value,
    //             deadline: this.state.caseDeadline.value.toUTCString(),
    //             notes: this.state.notes.value,
    //         }, showNewInfoFrom)
    //     } catch {
    //         if (this._isMounted) {
    //             this.setState({
    //                 projectWasSuccessfullyUpdated: false,
    //                 snackbarIsOpen: true,
    //             })
    //         }
    //         return;
    //     }

    //     if (this._isMounted) {
    //         this.setState({
    //             snackbarIsOpen: true,
    //             projectWasSuccessfullyUpdated: true,
    //             updateCaseInformationInProgress: false,
    //         })
    //     }
    // }

    // private handleCaseDeadlineChange = (newCaseDeadline: Date): void => {
    //     const updatedCaseDeadlineControl = this.state.caseDeadline.setValue(newCaseDeadline);
    //     this.setState({
    //         caseDeadline: updatedCaseDeadlineControl,
    //     });
    // }

    // private handleCaseNameChange = (event: any): void => {
    //     const newCaseName = event.target.value;
    //     const updatedCaseNameControl = this.state.caseName.setValue(newCaseName);
    //     this.setState({
    //         caseName: updatedCaseNameControl,
    //     })
    // }

    // private handleNotesChange = (event: any): void => {
    //     const newCaseNotes = event.target.value;
    //     const updatedCaseNotesControl = this.state.notes.setValue(newCaseNotes);
    //     this.setState({
    //         notes: updatedCaseNotesControl,
    //     })
    // }
}

const mapStateToProps = ({
    userState,
    existingCaseState,
}: IAppState) => ({
    userState,
    existingCaseState,
});

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
    setControlValues: (controlValue: any) => {
        const setControlValueAction = setCaseCreationControlValues(controlValue);
        dispatch(setControlValueAction);
    },
});

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ProjectPresentation as any);
export const Project = withRouter(withTheme()(connectedComponent as any) as any);