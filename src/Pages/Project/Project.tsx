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
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
// import * as admin from 'firebase-admin';
import * as React from "react";
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { AsyncButton } from "src/Components/AsyncButton/AsyncButton";
import { CaseDeadlineEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/CaseDeadlineEdit/CaseDeadlineEdit";
import { CheckboxEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/CheckboxEdit/CheckboxEdit";
import { DateEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/DateEdit/DateEdit";
import { DoctorInformationEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/DoctorInformationEdit/DoctorInformation";
import { DropdownEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/DropdownEdit/DropdownEdit";
import { FileEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/FileEdit/FileEdit";
import { MultilineTextEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/MultilineTextEdit/MultilineTextEdit";
import { NonEditableText } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/NonEditableText/NonEditableText";
import { NumberEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/NumberEdit/NumberEdit";
import { PatientNameEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/PatientNameEdit/PatientNameEdit";
import { SingleLineTextEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/SingleLineTextEdit/SingleLineTextEdit";
import { TitleEdit } from "src/Components/PrescriptionEdit/PrescriptionEditComponents/TitleEdit/TitleEdit";
import { ICase } from "src/Models/case";
import { ICaseCheckpoint } from "src/Models/caseCheckpoint";
import { IDoctorUser } from "src/Models/doctorUser";
import { INonEditableTextField } from "src/Models/prescription/controls/nonEditableTextField";
import { INumberTemplateControl } from "src/Models/prescription/controls/numberTemplateControl";
import { IPrescriptionControlTemplateType } from "src/Models/prescription/controls/prescriptionControlTemplateType";
import { ITitleTemplateControl } from "src/Models/prescription/controls/titleTemplateControl";
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
            projectContainer,
            workflowToolbar,
            contentContainer,
            caseProgressPaper,
            tabsContainer,
            createCaseButtonContainer,
            prescriptionPaper,
            loadingCheckpointsContainer,
            circularProgressContainer,
            sectionsContainer,
            controlContainer,
            sectionContainer,
            companyLogoImage,
            companyLogoContainer,
            formContainer,
        } = createProjectPresentationClasses(this.props, this.state, this.props.theme);

        const companyId = this.props.location.pathname.split('/')[2];
        const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;
        const mappedCheckpoints = this.state.checkpoints ? (
            this.state.checkpoints!.filter((checkpoint: ICaseCheckpoint) => {
                if (userIsDoctor) {
                    return checkpoint.visibleToDoctor;
                } else {
                    return true;
                }
            }).map((checkpoint: ICaseCheckpoint, index: number) => {
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
                            {!dataIsReady ? (
                                <div className={circularProgressContainer}>
                                    <CircularProgress
                                        color="primary"
                                        size={64}
                                        thickness={3}
                                    />
                                </div>
                            ) : (
                                <div className={formContainer}>
                                    {this.state.companyLogoDownloadURL ? (
                                        <div className={companyLogoContainer}>
                                            <img src={this.state.companyLogoDownloadURL} className={companyLogoImage}/>
                                        </div>
                                    ) : undefined}
                                     <div className={sectionsContainer}>
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
                                </div>
                            )}
                            {!this.state.loadingPrescriptionTemplate ? (
                                <div className={`${createCaseButtonContainer} hide-on-print`}>
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
            caseObject,
        ] = await Promise.all([
            Api.projectsApi.getProject(caseId),
        ]);

        const showNewInfoFromDoctor = caseObject.showNewInfoFrom === ShowNewInfoFromType.Doctor;
        const showNewInfoFromLab = caseObject.showNewInfoFrom === ShowNewInfoFromType.Lab;

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
                caseObject.prescriptionTemplateId,
            ),
            Api.userApi.getUser((caseObject as ICase).doctorCompanyUserId),
        ]);

        // tslint:disable-next-line:no-console
        console.log('prescriptionFormTemplate: ', prescriptionFormTemplate);

        const doctorUser = user as IDoctorUser;

        if (prescriptionFormTemplate.companyLogoURL) {
            await this.createCompanyLogoDownloadURL(prescriptionFormTemplate.companyLogoURL);
        }

        if (this._isMounted) {
            this.setState({
                checkpoints: caseObject.caseCheckpoints,
                retrievingCheckpoints: false,
                prescriptionFormTemplate,
                loadingPrescriptionTemplate: false,
                doctorUser,
            })

            this.props.setControlValues(caseObject.controlValues);
        }
    }

    private createCompanyLogoDownloadURL = async(companyLogoURL: string) => {
        const storageRef = firebase.storage().ref();
        const companyLogoDownloadURL = await storageRef.child(companyLogoURL).getDownloadURL();

        if (this._isMounted) {
            this.setState({
                companyLogoDownloadURL,
            });
        }
    }

    private handleSnackbarClose = (): void => {
        if (this._isMounted) {
            this.setState({
                snackbarIsOpen: false,
            })
        }
    }

    private updateCase = async() => {
        if (this._isMounted) {
            this.setState({
                updateCaseInformationInProgress: true,
            });
        }

        const caseId = this.props.match.params['projectId'];
        const companyId = this.props.location.pathname.split('/')[2];
        const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;
        const showNewInfoFrom = userIsDoctor ? ShowNewInfoFromType.Doctor : ShowNewInfoFromType.Lab;

        await Api.projectsApi.updateCaseInformation(caseId, {
            controlValues: this.props.existingCaseState!.controlValues,
        }, showNewInfoFrom);

        if (this._isMounted) {
            this.setState({
                updateCaseInformationInProgress: false,
                snackbarIsOpen: true,
            })
        }
    }

    private handleChange = (event: any, tabIndex: number) => {
        if (this._isMounted) {
            this.setState({
                tabIndex,
            })
        }
    }

    private correctControlDisplay = (controlId: string) => {
        const control = this.state.prescriptionFormTemplate!.controls[controlId];
        const controlValue = this.props.existingCaseState.controlValues[control.id]
        const updatingCaseInformation = this.state.updateCaseInformationInProgress;
        const caseId = this.props.match.params['projectId'];

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
        } else if (control.type === IPrescriptionControlTemplateType.File) {
            return (
                <FileEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={false}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                    caseId={caseId}
                />
            )
        } else if (control.type === IPrescriptionControlTemplateType.PatientName) {
            return (
                <PatientNameEdit
                    control={control}
                    controlValue={controlValue}
                    disabled={true}
                    updateControlValueActionCreator={updateExistingCaseControlValue}
                />
            )
        }

        return <div/>
    }

    private handleCheckpointChange = (checkpoint: ICaseCheckpoint, index: number) => async() => {
        const companyId = this.props.location.pathname.split('/')[2];
        const currentUser = this.props.userState[companyId];

        const completedByCompanyUserId = !checkpoint.complete ? currentUser.id : null;
        const completedByName = !checkpoint.complete ? currentUser.name : null;
        const checkpoints = this.state.checkpoints!.map((compareCheckpoint, compareIndex) => {
            if (index === compareIndex) {
                return {
                    ...checkpoint,
                    complete: !compareCheckpoint.complete,
                    completedByCompanyUserId,
                    completedByName,
                }
            } else {
                return compareCheckpoint;
            }
        })

        if (this._isMounted) {
            this.setState({
                checkpoints,
            })
        }

        const caseId = this.props.match.params['projectId'];
        await Api.projectsApi.updateCaseCheckpoints(caseId, checkpoints);
    }

    private showQrCodeDialog = (): void => {
        const content = this.createPdfContent();
        pdfMake.createPdf({
            content,
            pageOrientation: 'LANDSCAPE' as any,
            styles: {
                title: {
                    fontSize: 14,
                    bold: true,
                },
                label: {
                    fontSize: 10,
                    bold: false,
                    color: 'black',
                },
                otherText: {
                    fontSize: 10,
                    bold: false,
                    color: '#8E8E8E',
                }
            }
        }).print();
    }

    private createPdfContent = (): pdfMake.Content => {
        const pdfContent: pdfMake.Content = [];
        // const doctorUser = this.state.doctorUser!;
        const caseId = this.props.match.params['projectId'];
        const controlValues = this.props.existingCaseState.controlValues;
        pdfContent.push({
            columns: [
                {
                    width: '*',
                    text: '',
                },
                {
                    width: 100,
                    text: '',
                },
                {
                    qr: caseId,
                    fit: '50',
                    width: 'auto',
                },
            ],
            margin: 0,
        })
        this.state.prescriptionFormTemplate!.sectionOrder.forEach((sectionId, sectionIndex) => {
            const sections = this.state.prescriptionFormTemplate!.sections;
            const currentSection = sections[sectionId];
            const controlOrderForSection = currentSection.controlOrder;
            const noControlForSection = controlOrderForSection.length === 0;

            if (noControlForSection) {
                return;
            }

            const sectionContent: pdfMake.Content = [];

            controlOrderForSection.forEach((controlId) => {
                const control = this.state.prescriptionFormTemplate!.controls[controlId];
                const controlValue = controlValues[controlId];
                switch (control.type) {
                    case IPrescriptionControlTemplateType.Checkbox:
                        if (!controlValue) {
                            return;
                        }
                        const selectedOptions = control.options.filter((option) => {
                            return controlValue[option.id];
                        }).map((option) => {
                            return option.text;
                        }).join(', ');
                        if (selectedOptions.length > 0) {
                            sectionContent.push({
                                columns: [
                                    {
                                        text: `${control.label}:`,
                                        style: ['label'],
                                        width: 'auto',
                                    },
                                    {
                                        text: selectedOptions,
                                        style: ['otherText'],
                                        width: 'auto',
                                        margin: [8, 0, 0, 0],
                                    }
                                ],
                                margin: [0, 0, 0, 4],
                            });
                        }
                        break;
                    case IPrescriptionControlTemplateType.Date:
                    case IPrescriptionControlTemplateType.CaseDeadline:
                        if (!controlValue) {
                            return;
                        }
                        const prettyDeadline = this.makeDeadlinePretty(controlValue.toDate());
                        sectionContent.push({
                            columns: [
                                {
                                    text: `${control.label}:`,
                                    style: ['label'],
                                    width: 'auto',
                                },
                                {
                                    text: prettyDeadline,
                                    style: ['otherText'],
                                    width: 'auto',
                                    margin: [8, 0, 0, 0],
                                }
                            ],
                            margin: [0, 0, 0, 4],
                        })
                        break;
                    case IPrescriptionControlTemplateType.DoctorInformation:
                        const doctorUser = this.state.doctorUser!;
                        sectionContent.push({
                            columns: [
                                {
                                    text: 'Doctor Name:',
                                    style: ['label'],
                                    width: 'auto',
                                },
                                {
                                    text: doctorUser.name,
                                    style: ['otherText'],
                                    width: 'auto',
                                    margin: [8, 0, 0, 0],
                                }
                            ],
                            margin: [0, 0, 0, 4],
                        });
                        sectionContent.push({
                            columns: [
                                {
                                    text: 'Street:',
                                    style: ['label'],
                                    width: 'auto',
                                },
                                {
                                    text: doctorUser.address.street,
                                    style: ['otherText'],
                                    width: 'auto',
                                    margin: [8, 0, 0, 0],
                                }
                            ],
                            margin: [0, 0, 0, 4],
                        });
                        sectionContent.push({
                            columns: [
                                {
                                    text: 'City:',
                                    style: ['label'],
                                    width: 'auto',
                                },
                                {
                                    text: doctorUser.address.city,
                                    style: ['otherText'],
                                    width: 'auto',
                                    margin: [8, 0, 0, 0],
                                }
                            ],
                            margin: [0, 0, 0, 4],
                        });
                        sectionContent.push({
                            columns: [
                                {
                                    text: 'State:',
                                    style: ['label'],
                                    width: 'auto',
                                },
                                {
                                    text: doctorUser.address.state,
                                    style: ['otherText'],
                                    width: 'auto',
                                    margin: [8, 0, 0, 0],
                                }
                            ],
                            margin: [0, 0, 0, 4],
                        });
                        sectionContent.push({
                            columns: [
                                {
                                    text: 'Telephone:',
                                    style: ['label'],
                                    width: 'auto',
                                },
                                {
                                    text: doctorUser.telephone,
                                    style: ['otherText'],
                                    width: 'auto',
                                    margin: [8, 0, 0, 0],
                                }
                            ],
                            margin: [0, 0, 0, 4],
                        });
                        break;
                    case IPrescriptionControlTemplateType.Dropdown:
                        const selectedOption = control.options.find((option) => option.id === controlValue)!;
                        if (selectedOption) {
                            sectionContent.push({
                                columns: [
                                    {
                                        text: `${control.label}:`,
                                        style: ['label'],
                                        width: 'auto',
                                    },
                                    {
                                        text: selectedOption.text,
                                        style: ['otherText'],
                                        width: 'auto',
                                        margin: [8, 0, 0, 0],
                                    }
                                ],
                                margin: [0, 0, 0, 4],
                            });
                        }
                        break;
                    case IPrescriptionControlTemplateType.MultilineText:
                        if (!controlValue) {
                            return;
                        }
                        sectionContent.push({
                            columns: [
                                {
                                    text: `${control.label}:`,
                                    style: ['label'],
                                    width: 'auto',
                                },
                                {
                                    text: controlValue,
                                    style: ['otherText'],
                                    width: 'auto',
                                    margin: [8, 0, 0, 0],
                                }
                            ],
                            margin: [0, 0, 0, 4],
                        });
                        break;
                    case IPrescriptionControlTemplateType.Number:
                        if (!controlValue) {
                            return;
                        }
                        const numberTextControl = control as INumberTemplateControl;
                        const formattedNumber = `${numberTextControl.prefix} ${controlValue} ${numberTextControl.suffix}`;
                        sectionContent.push({
                            columns: [
                                {
                                    text: `${control.label}:`,
                                    style: ['label'],
                                    width: 'auto',
                                },
                                {
                                    text: formattedNumber,
                                    style: ['otherText'],
                                    width: 'auto',
                                    margin: [8, 0, 0, 0],
                                }
                            ],
                            margin: [0, 0, 0, 4],
                        });
                        break;
                    case IPrescriptionControlTemplateType.SingleLineText:
                        if (!controlValue) {
                            return;
                        }
                        sectionContent.push({
                            columns: [
                                {
                                    text: `${control.label}:`,
                                    style: ['label'],
                                    width: 'auto',
                                },
                                {
                                    text: controlValue,
                                    style: ['otherText'],
                                    width: 'auto',
                                    margin: [8, 0, 0, 0],
                                }
                            ],
                            margin: [0, 0, 0, 4],
                        });
                        break;
                    case IPrescriptionControlTemplateType.Title:
                        const titleControl = control as ITitleTemplateControl;
                        sectionContent.push({
                            text: titleControl.title,
                            style: ['title'],
                            margin: [0, 0, 0, 8],
                        })
                        break;
                    case IPrescriptionControlTemplateType.NonEditableText:
                        const nonEditableTextControl = control as INonEditableTextField;
                        sectionContent.push({
                            text: nonEditableTextControl.text,
                            style: 'label',
                            margin: [0, 0, 0, 4],
                        });
                        break;
                    default:
                        break;
                }
            })

            sectionContent.push({
                text: '',
                margin: [0, 0, 0, 16],
            })

            pdfContent.push(sectionContent);
        })
        return pdfContent;
    }

    private makeDeadlinePretty = (date: Date): string => {
        const dateCalendarDay = date.getDate();
        const dateCalendarMonth = date.getMonth() + 1;
        const dateCalendarYear = date.getFullYear();

        return `${dateCalendarMonth}/${dateCalendarDay}/${dateCalendarYear}`;
    }
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