import DoneIcon from '@material-ui/icons/Done';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
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
} from "@material-ui/core";
import * as firebase from 'firebase';
import {
    useEffect,
    useState,
} from "react";
import * as React from "react";
import { useDispatch } from 'react-redux';
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
import { useCaseId } from "src/CustomHooks/useCaseId";
import { useCompanyId } from "src/CustomHooks/useCompanyId";
import { useExistingCaseSliceOfState } from "src/CustomHooks/useExistingCaseSliceOfState";
import { useUserState } from "src/CustomHooks/useUserState";
import { ICase } from "src/Models/case";
import { ICaseCheckpoint } from 'src/Models/caseCheckpoint';
import { IDoctorUser } from "src/Models/doctorUser";
import { INonEditableTextField } from 'src/Models/prescription/controls/nonEditableTextField';
import { INumberTemplateControl } from 'src/Models/prescription/controls/numberTemplateControl';
import { IPrescriptionControlTemplateType } from "src/Models/prescription/controls/prescriptionControlTemplateType";
import { ITitleTemplateControl } from 'src/Models/prescription/controls/titleTemplateControl';
import { IPrescriptionFormTemplate } from "src/Models/prescription/prescriptionFormTemplate";
import { ShowNewInfoFromType } from "src/Models/showNewInfoFromTypes";
import { UserType } from "src/Models/userTypes";
import { setCaseCreationControlValues, updateExistingCaseControlValue } from "src/Redux/ActionCreators/existingCaseActionCreators";
import Api from '../../Api/api';
import { createProjectPresentationClasses } from './Project.ias';

export const Project: React.SFC<any>= (props) => {
    const [tabIndex, setTabIndex] = useState(0);
    function handleTabChange(event: any, tabIndexFromChange: number) {
        setTabIndex(tabIndexFromChange);
    }

    const caseId = useCaseId();
    const companyId = useCompanyId();
    const userState = useUserState();
    const dispatch = useDispatch();

    const [isLoadingPrescriptionTemplate, setIsLoadingPrescriptionTemplate] = useState(true);
    const [isLoadingCheckpoints, setIsLoadingCheckpoint] = useState(true);
    const [companyLogoDownloadURL, setCompanyLogoDownloadURL] = useState<string | null>(null);
    const [caseCheckpoints, setCaseCheckpoints] = useState<ICaseCheckpoint[] | null>(null);
    const [prescriptionFormTemplate, setPrescriptionFormTemplate] = useState<IPrescriptionFormTemplate | null>(null);
    const [doctorUser, setDoctorUser] = useState<IDoctorUser | null>(null);
    const userIsDoctor = userState[companyId].type === UserType.Doctor;
    useEffect(() => {
        Api.projectsApi.getProject(caseId).then((caseObject) => {
            const showNewInfoFromDoctor = caseObject.showNewInfoFrom === ShowNewInfoFromType.Doctor;
            const showNewInfoFromLab = caseObject.showNewInfoFrom === ShowNewInfoFromType.Lab;

            const shouldMarkAsShown = (showNewInfoFromDoctor && !userIsDoctor) || (showNewInfoFromLab && userIsDoctor);

            if (shouldMarkAsShown) {
                Api.projectsApi.markProjectUpdatesAsSeen(companyId, caseId);
            }

            Promise.all([
                Api.prescriptionTemplateApi.getPrescriptionTemplateById(
                    caseObject.prescriptionTemplateId,
                ),
                Api.userApi.getUser((caseObject as ICase).doctorCompanyUserId),
            ]).then(([
                prescriptionFormTemplateFromRequest,
                doctorUserFromRequest,
            ]) => {

            function createCompanyLogoDownloadURL(companyLogoURL: string): void {
                const storageRef = firebase.storage().ref();
                storageRef.child(companyLogoURL).getDownloadURL().then((actualCompanyLogoDownloadURL: string) => {
                    setCompanyLogoDownloadURL(actualCompanyLogoDownloadURL);
                });
            }

                if (prescriptionFormTemplateFromRequest.companyLogoURL) {
                    createCompanyLogoDownloadURL(prescriptionFormTemplateFromRequest.companyLogoURL);
                }

                setIsLoadingPrescriptionTemplate(false);
                setIsLoadingCheckpoint(false);
                setCaseCheckpoints(caseObject.caseCheckpoints);
                setPrescriptionFormTemplate(prescriptionFormTemplateFromRequest);
                setDoctorUser(doctorUserFromRequest as IDoctorUser);

                const setControlValuesAction = setCaseCreationControlValues(caseObject.controlValues);
                dispatch(setControlValuesAction);
            })
        });
    }, []);

    const [updateCaseInformationInProgress, setUpdateCaseInformationInProgress] = useState(false);
    const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
    async function updateCase () {
        setUpdateCaseInformationInProgress(true);

        const showNewInfoFrom = userIsDoctor ? ShowNewInfoFromType.Doctor : ShowNewInfoFromType.Lab;

        await Api.projectsApi.updateCaseInformation(caseId, {
            controlValues: existingCaseState!.controlValues,
        }, showNewInfoFrom);

        setUpdateCaseInformationInProgress(false);
        setSnackbarIsOpen(true);
    }

    function showQrCodeDialog(): void {
        const content = createPdfContent();
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

    function createPdfContent(): pdfMake.Content {
        const pdfContent: pdfMake.Content = [];
        const controlValues = existingCaseState.controlValues;
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
        prescriptionFormTemplate!.sectionOrder.forEach((sectionId, sectionIndex) => {
            const sections = prescriptionFormTemplate!.sections;
            const currentSection = sections[sectionId];
            const controlOrderForSection = currentSection.controlOrder;
            const noControlForSection = controlOrderForSection.length === 0;

            if (noControlForSection) {
                return;
            }

            const sectionContent: pdfMake.Content = [];

            controlOrderForSection.forEach((controlId) => {
                const control = prescriptionFormTemplate!.controls[controlId];
                const controlValue = controlValues[controlId];
                switch (control.type) {
                    case IPrescriptionControlTemplateType.Checkbox:
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
                        const prettyDeadline = makeDeadlinePretty(controlValue.toDate());
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
                        sectionContent.push({
                            columns: [
                                {
                                    text: 'Doctor Name:',
                                    style: ['label'],
                                    width: 'auto',
                                },
                                {
                                    text: doctorUser!.name,
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
                                    text: doctorUser!.address.street,
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
                                    text: doctorUser!.address.city,
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
                                    text: doctorUser!.address.state,
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
                                    text: doctorUser!.telephone,
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
                        });
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

    const existingCaseState = useExistingCaseSliceOfState();
    const controlValuesExist = Object.keys(existingCaseState.controlValues).length > 0;
    const dataIsReady = !isLoadingPrescriptionTemplate && controlValuesExist;

    function correctControlDisplay(controlId: string) {
        const control = prescriptionFormTemplate!.controls[controlId];
        const controlValue = existingCaseState.controlValues[control.id]
        const updatingCaseInformation = updateCaseInformationInProgress;

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
                    existingDoctorInformation={doctorUser}
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

    function makeDeadlinePretty(date: Date): string {
        const dateCalendarDay = date.getDate();
        const dateCalendarMonth = date.getMonth() + 1;
        const dateCalendarYear = date.getFullYear();

        return `${dateCalendarMonth}/${dateCalendarDay}/${dateCalendarYear}`;
    }

    function handleCheckpointChange(checkpoint: ICaseCheckpoint, index: number) {
        return async () => {
            const currentUser = userState[companyId];

            const completedByCompanyUserId = !checkpoint.complete ? currentUser.id : null;
            const completedByName = !checkpoint.complete ? currentUser.name : null;
            const checkpoints = caseCheckpoints!.map((compareCheckpoint, compareIndex) => {
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
            });

            setCaseCheckpoints(checkpoints);

            await Api.projectsApi.updateCaseCheckpoints(caseId, checkpoints);
        }
    }

    function onCloseSnackbar(): void {
        setSnackbarIsOpen(false);
    }

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
    } = createProjectPresentationClasses(companyLogoDownloadURL);

    return (
        <div className={projectContainer}>
            <div className={tabsContainer}>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label="Prescription"/>
                    <Tab label="Case Progress"/>
                </Tabs>
            </div>
            <div className={contentContainer}>
                {tabIndex === 0 && (
                    <Paper className={prescriptionPaper}>
                        {!dataIsReady ? (
                            <div className={loadingCheckpointsContainer}>
                                <CircularProgress
                                    color="primary"
                                    size={64}
                                    thickness={3}
                                />
                            </div>
                        ) : (
                            <div className={formContainer}>
                                {companyLogoDownloadURL ? (
                                    <div className={companyLogoContainer}>
                                        <img src={companyLogoDownloadURL} className={companyLogoImage}/>
                                    </div>
                                ) : undefined}
                                <div className={sectionsContainer}>
                                    {prescriptionFormTemplate!.sectionOrder.map((sectionId, sectionIndex) => {
                                        const sections = prescriptionFormTemplate!.sections;
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
                                                            {correctControlDisplay(controlId)}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        {!isLoadingPrescriptionTemplate ? (
                            <div className={createCaseButtonContainer}>
                                <Button onClick={showQrCodeDialog} color="secondary">
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
                                            disabled={updateCaseInformationInProgress}
                                            asyncActionInProgress={updateCaseInformationInProgress}
                                            onClick={updateCase}>
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
                        {isLoadingCheckpoints ? (
                            <div className={circularProgressContainer}>
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
                                {caseCheckpoints ? (
                                    <TableBody>
                                        {caseCheckpoints ? (
                                            caseCheckpoints.filter((checkpoint: ICaseCheckpoint) => {
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
                                                                        onChange={handleCheckpointChange(checkpoint, index)}
                                                                        color="primary"
                                                                    />
                                                                ) : undefined}
                                                            </TableCell>
                                                            {!userIsDoctor ? (
                                                                <TableCell>{checkpoint.completedByName}</TableCell>
                                                            ) : undefined}
                                                        </TableRow>
                                                    )
                                                })
                                        ) : <div/>}
                                    </TableBody>
                                ) : undefined}
                            </Table>
                        </div>
                    </Paper>
                )}
                <Snackbar
                    open={snackbarIsOpen}
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
                    onClose={onCloseSnackbar}
                />
            </div>
        </div>
    )
}