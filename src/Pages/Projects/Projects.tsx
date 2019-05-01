import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputLabel,
    ListItem,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TableFooter,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import FilterListIcon from '@material-ui/icons/FilterList';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import NotificationsIcon from '@material-ui/icons/Notifications';
import * as firebase from 'firebase';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ICasesSearchRequest } from 'src/Api/Projects/projectsInterface';
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import { IAugmentedCase } from 'src/Models/case';
import { ICaseFilter } from 'src/Models/caseFilter/caseFilter';
import { DoctorFlag } from 'src/Models/caseFilter/doctorFlag';
import { NotificationFlag } from 'src/Models/caseFilter/notificationFlag';
import { IDoctorUser } from 'src/Models/doctorUser';
import { ShowNewInfoFromType } from 'src/Models/showNewInfoFromTypes';
import { UserType } from 'src/Models/userTypes';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import Api from '../../Api/api';
import { CheckpointFlag } from '../../Models/caseFilter/checkpointFlag';
import { CompletionStatus } from '../../Models/caseFilter/completionStatus';
import { StartedStatus } from '../../Models/caseFilter/startedStatus';
import { createProjectsPresentationClasses, IProjectsPresentationProps, IProjectsPresentationState } from './Projects.ias';

export class ProjectsPresentation extends React.Component<IProjectsPresentationProps, IProjectsPresentationState> {
    public searchInputNode: any;
    public state: IProjectsPresentationState = {
        cases: [],
        loadingCases: true,
        moreCasesExist: true,
        page: 0,
        limit: 20,
        startingCases: [],
        retrievingQRCodes: false,
        showFilterCasesDialog: false,
        selectedFilter: {
            completionStatus: CompletionStatus.All,
            startedStatus: StartedStatus.All,
            doctorFlag: DoctorFlag.All,
            checkpointFlag: CheckpointFlag.All,
            notificationFlag: NotificationFlag.All,
        },
        dialogDisplayFilter: {
            completionStatus: CompletionStatus.All,
            startedStatus: StartedStatus.All,
            doctorFlag: DoctorFlag.All,
            checkpointFlag: CheckpointFlag.All,
            notificationFlag: NotificationFlag.All,
        },
        doctorSearchValue: '',
        potentialDoctors: [],
        selectedDoctorInformation: null,
        selectedFilterCheckpoint: '',
        workflowCheckpoints: [],
    }

    // tslint:disable-next-line:variable-name
    public _isMounted: boolean;

    public async componentWillMount(): Promise<void> {
        this._isMounted = true;
        const companyId = this.props.match.path.split('/')[2];
        const casesSearchRequest: ICasesSearchRequest = {
            companyId,
            limit: this.state.limit,
            ...this.state.selectedFilter,
        }

        const userType = this.props.userState[companyId].type;
        const userId = this.props.userState[companyId].id;

        const getWorkflowCheckpointsPromise = Api.workflowApi.getWorkflow(companyId);
        const getSlimCasesPromise = Api.projectsApi.searchCases(casesSearchRequest, userType, userId);

        const [
            workflowCheckpoints,
            caseDocumentSnapshots,
        ] = await Promise.all([
            getWorkflowCheckpointsPromise,
            getSlimCasesPromise,
        ]);

        const cases: IAugmentedCase[] = [];
        caseDocumentSnapshots.forEach((document) => {
            const data = document.data();
            const createdFromRequest = data!.created as firebase.firestore.Timestamp;
            const deadlineFromRequest = data!.deadline as firebase.firestore.Timestamp;

            cases.push({
                id: document.id,
                document,
                ...document.data() as any,
                created: new firebase.firestore.Timestamp(createdFromRequest.seconds, createdFromRequest.nanoseconds),
                deadline: new firebase.firestore.Timestamp(deadlineFromRequest.seconds, deadlineFromRequest.nanoseconds),
            })
        });
        const moreCasesExist = cases.length === 5;
        if (this._isMounted) {
            this.setState({
                cases,
                loadingCases: false,
                moreCasesExist,
                startingCases: [cases[0]],
                workflowCheckpoints,
            })
        }
    }

    public componentWillUnmount(): void {
        this._isMounted = false;
    }

    public render() {
        const {
            rowStyling,
            projectsContainer,
            projectsToolbarContainer,
            projectsPaper,
            tableBody,
            arrowContainer,
            tableContainer,
            nameAndFilterIconContainer,
            gridNameContainer,
            filterCasesDialogActionButtons,
            rowRadioGroup,
            dialogContent,
            doctorSearchContainer,
            doctorContainer,
            selectedDoctorContainer,
            checkpointsContainer,
            checkpointOptionsAndSelectedOptionsContainer,
            allSelectedCheckpointsContainer,
            selectedCheckpointContainer,
        } = createProjectsPresentationClasses(this.props, this.state);

        const companyId = this.props.match.path.split('/')[2];
        const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;

        const mappedProjects = this.state.cases.map(caseObject => {
            const newInfoFromDoctor = caseObject.showNewInfoFrom === ShowNewInfoFromType.Doctor;
            const newInfoFromLab = caseObject.showNewInfoFrom === ShowNewInfoFromType.Lab;

            const shouldShowNotification = (userIsDoctor && newInfoFromLab) || (!userIsDoctor && newInfoFromDoctor);
            const newInfoCell = shouldShowNotification ? (
                <TableCell>
                    <NotificationsIcon/>
                </TableCell>
            ) : <TableCell/>;

            const date = caseObject.deadline.toDate();
            const prettyDeadline = this.makeDeadlinePretty(date);
            const currentCheckpointName = userIsDoctor ? caseObject.currentDoctorCheckpointName : caseObject.currentLabCheckpointName;
            return (
                <TableRow key={caseObject.id} onClick={this.navigateToProject(caseObject.id)} className={rowStyling}>
                    <TableCell>{caseObject.doctorName}</TableCell>
                    <TableCell>{prettyDeadline}</TableCell>
                    <TableCell>{caseObject.complete ? <DoneIcon/> : undefined}</TableCell>
                    <TableCell>{caseObject.hasStarted ? <DoneIcon/> : undefined}</TableCell>
                    <TableCell>{currentCheckpointName}</TableCell>
                    {newInfoCell}
                </TableRow>
            )
        });

        const checkpointItems = this.state.workflowCheckpoints.filter((workflowCheckpoint) => {
            return this.state.selectedFilterCheckpoint !== workflowCheckpoint.id;
        }).map((workflowCheckpoint, index) => {
            return (
                <MenuItem
                    value={workflowCheckpoint.id}
                    key={index}
                >
                    {workflowCheckpoint.name}
                </MenuItem>
            )
        });

        const selectedCheckpoint = this.state.workflowCheckpoints.find((workflowCheckpoint) => {
            return workflowCheckpoint.id === this.state.selectedFilterCheckpoint;
        });

        const {
            completionStatus,
            startedStatus,
            doctorFlag,
            // doctorId,
            checkpointFlag,
            // checkpointsIds,
            notificationFlag,
        } = this.state.dialogDisplayFilter;

        return (
            <div className={projectsContainer}>
                <Paper className={projectsPaper}>
                    <Toolbar className={projectsToolbarContainer}>
                        <div className={nameAndFilterIconContainer}>
                            <Typography variant="title" className={gridNameContainer}>
                                Cases
                            </Typography>
                            <Tooltip title="Filter Cases" placement="right" disableFocusListener={true}>
                                <IconButton
                                    aria-label="Filter Cases"
                                    onClick={this.openFilterCasesDialog}
                                >
                                    <FilterListIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div>
                            <Tooltip title="New Case" placement="left" disableFocusListener={true}>
                                <IconButton
                                    aria-label="New Case"
                                    onClick={this.navigateToCreateProjectPage}
                                    color="secondary"
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Toolbar>
                    <div className={tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Doctor</TableCell>
                                    <TableCell>Case Deadline</TableCell>
                                    <TableCell>Complete</TableCell>
                                    <TableCell>Started</TableCell>
                                    <TableCell>Current Checkpoint</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody className={tableBody}>
                                {mappedProjects}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div className={arrowContainer}>
                                            <IconButton onClick={this.loadPreviousCases} disabled={this.state.page === 0}>
                                                <KeyboardArrowLeftIcon/>
                                            </IconButton>
                                            <IconButton onClick={this.loadNextCases} disabled={this.noMoreCasesAvailable()}>
                                                <KeyboardArrowRightIcon/>
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                        <Dialog open={this.state.showFilterCasesDialog} maxWidth={"lg"} fullWidth={true}>
                            <DialogTitle>Filters</DialogTitle>
                            <DialogContent className={dialogContent}>
                                <FormControl fullWidth={true}>
                                    <FormLabel>Case Completion Status</FormLabel>
                                    <RadioGroup className={rowRadioGroup} value={completionStatus} onChange={this.handleDialogFilterChange('completionStatus')}>
                                        <FormControlLabel value={CompletionStatus.All} control={<Radio/>} label="All"/>
                                        <FormControlLabel value={CompletionStatus.Complete} control={<Radio/>} label="Complete Cases"/>
                                        <FormControlLabel value={CompletionStatus.Incomplete} control={<Radio/>} label="Incomplete Cases"/>
                                    </RadioGroup>
                                </FormControl>
                                <FormControl fullWidth={true}>
                                    <FormLabel>Case Started Status</FormLabel>
                                    <RadioGroup className={rowRadioGroup} value={startedStatus} onChange={this.handleDialogFilterChange('startedStatus')}>
                                        <FormControlLabel value={StartedStatus.All} control={<Radio/>} label="All"/>
                                        <FormControlLabel value={StartedStatus.Started} control={<Radio/>} label="Started Cases"/>
                                        <FormControlLabel value={StartedStatus.NotStarted} control={<Radio/>} label="Unstarted Cases"/>
                                    </RadioGroup>
                                </FormControl>
                                {userIsDoctor ? undefined : (
                                    <div className={doctorContainer}>
                                        <FormControl>
                                            <FormLabel>Doctors</FormLabel>
                                            <RadioGroup className={rowRadioGroup} value={doctorFlag} onChange={this.handleDialogFilterChange('doctorFlag')}>
                                                <FormControlLabel value={DoctorFlag.All} control={<Radio/>} label="All"/>
                                                <FormControlLabel value={DoctorFlag.Specific} control={<Radio/>} label="Specific Doctor"/>
                                            </RadioGroup>
                                        </FormControl>
                                        {doctorFlag === DoctorFlag.Specific ? (
                                            <div className={doctorSearchContainer}>
                                                <TextField
                                                    fullWidth={true}
                                                    placeholder="Search Doctors"
                                                    value={this.state.doctorSearchValue}
                                                    InputProps={{
                                                        inputRef: (node) => {
                                                            this.searchInputNode = node;
                                                        },
                                                    }}
                                                    onChange={this.handleDoctorSearch}
                                                />
                                                <div>
                                                    {this.state.potentialDoctors.length === 0 && this.state.doctorSearchValue !== '' ? (
                                                        <ListItem>
                                                            No doctors match the specified search.
                                                        </ListItem>
                                                    ) : undefined}
                                                    {this.state.potentialDoctors.map((potentialDoctor) => {
                                                        return (
                                                            <MenuItem key={potentialDoctor.id} onClick={this.selectDoctor(potentialDoctor)}>
                                                                {potentialDoctor.fullName} ({potentialDoctor.email})
                                                            </MenuItem>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ) : undefined}
                                        {doctorFlag === DoctorFlag.Specific && !!this.state.selectedDoctorInformation ? (
                                            <div className={selectedDoctorContainer}>
                                                <Typography variant="body1">Selected Doctor: {this.state.selectedDoctorInformation.fullName}</Typography>
                                            </div>
                                        ) : undefined}
                                    </div>
                                )}
                                {userIsDoctor ? undefined : (
                                    <div className={checkpointsContainer}>
                                        <FormControl>
                                            <FormLabel>Checkpoints</FormLabel>
                                            <RadioGroup className={rowRadioGroup} value={checkpointFlag} onChange={this.handleDialogFilterChange('checkpointFlag')}>
                                                <FormControlLabel value={CheckpointFlag.All} control={<Radio/>} label="All"/>
                                                <FormControlLabel value={CheckpointFlag.Specific} control={<Radio/>} label="Specific Checkpoints"/>
                                            </RadioGroup>
                                        </FormControl>
                                        {checkpointFlag === CheckpointFlag.Specific ? (
                                            <div className={checkpointOptionsAndSelectedOptionsContainer}>
                                                <div className={selectedCheckpointContainer}>
                                                    <FormControl fullWidth={true} disabled={checkpointItems.length === 0}>
                                                        <InputLabel>Selected Checkpoints</InputLabel>
                                                        <Select value={""} onChange={this.handleSelectFilterCheckpoint}>
                                                            {checkpointItems}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className={allSelectedCheckpointsContainer}>
                                                    <Typography variant="body1">Selected Checkpoint: {selectedCheckpoint ? selectedCheckpoint!.name : ''}</Typography>
                                                </div>
                                            </div>
                                        ) : undefined}
                                    </div>
                                )}
                                <FormControl fullWidth={true}>
                                    <FormLabel>Notifications</FormLabel>
                                    <RadioGroup className={rowRadioGroup} value={notificationFlag} onChange={this.handleDialogFilterChange('notificationFlag')}>
                                        <FormControlLabel value={NotificationFlag.All} control={<Radio/>} label="All"/>
                                        <FormControlLabel value={NotificationFlag.HasNotification} control={<Radio/>} label="Cases With Notifications"/>
                                    </RadioGroup>
                                </FormControl>
                            </DialogContent>
                            <DialogActions className={filterCasesDialogActionButtons}>
                                <Button onClick={this.closeFilterCasesDialog}>
                                    Close
                                </Button>
                                <AsyncButton disabled={this.state.loadingCases} asyncActionInProgress={this.state.loadingCases} color="secondary" onClick={this.applyCaseFilters}>
                                    Apply Filters
                                </AsyncButton>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Paper>
            </div>
        )
    }

    private applyCaseFilters = async() => {
        const clonedDialogDisplayFilter = cloneDeep(this.state.dialogDisplayFilter);

        this.setState({
            loadingCases: true,
        });

        const companyId = this.props.match.path.split('/')[2];
        const casesSearchRequest: ICasesSearchRequest = {
            companyId,
            limit: this.state.limit,
            ...this.state.dialogDisplayFilter,
        }
        const userType = this.props.userState[companyId].type;
        const userId = this.props.userState[companyId].uid;

        const caseDocumentSnapshots = await Api.projectsApi.searchCases(casesSearchRequest, userType, userId);

        const cases: IAugmentedCase[] = [];
        caseDocumentSnapshots.forEach((document) => {
            const data = document.data();
            const createdFromRequest = data!.created as firebase.firestore.Timestamp;
            const deadlineFromRequest = data!.deadline as firebase.firestore.Timestamp;

            cases.push({
                id: document.id,
                document,
                ...document.data() as any,
                created: new firebase.firestore.Timestamp(createdFromRequest.seconds, createdFromRequest.nanoseconds),
                deadline: new firebase.firestore.Timestamp(deadlineFromRequest.seconds, deadlineFromRequest.nanoseconds),
            })
        });
        const moreCasesExist = cases.length === 5;

        if (this._isMounted) {
            this.setState({
                loadingCases: false,
                moreCasesExist,
                page: 0,
                cases,
                selectedFilter: clonedDialogDisplayFilter,
                showFilterCasesDialog: false,
            });
        }
    }

    private handleSelectFilterCheckpoint = (event: any) => {
        const dialogDisplayFilterClone = cloneDeep(this.state.dialogDisplayFilter);
        dialogDisplayFilterClone.checkpointId = event.target.value;

        if (this._isMounted) {
            this.setState({
                selectedFilterCheckpoint: event.target.value,
                dialogDisplayFilter: dialogDisplayFilterClone,
            });
        }
    }

    private handleDoctorSearch = async(event: any) => {
        const doctorSearchName = event.target.value;
        this.setState({
            doctorSearchValue: doctorSearchName,
        })

        const companyId = this.props.location.pathname.split('/')[2];

        const potentialDoctors = await Api.userApi.searchDoctorUsers(companyId, doctorSearchName);

        this.setState({
            potentialDoctors,
        })
    }

    private selectDoctor = (doctor: IDoctorUser) => () => {
        const dialogDisplayFilterClone = cloneDeep(this.state.dialogDisplayFilter);
        dialogDisplayFilterClone.doctorId = doctor.id;

        this.setState({
            selectedDoctorInformation: doctor,
            dialogDisplayFilter: dialogDisplayFilterClone,
            doctorSearchValue: '',
            potentialDoctors: [],
        })
    }

    private handleDialogFilterChange = (keyName: keyof ICaseFilter) => (event: any) => {
        const eventValue = event.target.value;

        const caseFilterCopy = cloneDeep(this.state.dialogDisplayFilter);
        caseFilterCopy[keyName] = eventValue;

        this.setState({
            dialogDisplayFilter: caseFilterCopy,
        })
    }

    private openFilterCasesDialog = () => {
        const selectedFilterClone = cloneDeep(this.state.selectedFilter);

        this.setState({
            showFilterCasesDialog: true,
            dialogDisplayFilter: selectedFilterClone,
        });
    }

    private closeFilterCasesDialog = () => {
        this.setState({
            showFilterCasesDialog: false,
        })
    }

    private loadPreviousCases = () => {
        if (this.state.page === 0) {
            return;
        }

        const companyId = this.props.match.path.split('/')[2];
        const casesSearchRequest: ICasesSearchRequest = {
            companyId,
            limit: this.state.limit,
            startAt: this.state.startingCases[this.state.page - 1].document,
            ...this.state.selectedFilter,
        }

        const userType = this.props.userState[companyId].type;
        const userId = this.props.userState[companyId].uid;

        Api.projectsApi.searchCases(casesSearchRequest, userType, userId).then((caseDocumentSnapshots) => {
            const cases: IAugmentedCase[] = [];
            caseDocumentSnapshots.forEach((document) => {
                const data = document.data();
                const createdFromRequest = data!.created as firebase.firestore.Timestamp;
                const deadlineFromRequest = data!.deadline as firebase.firestore.Timestamp;

                cases.push({
                    id: document.id,
                    document,
                    ...document.data() as any,
                    created: new firebase.firestore.Timestamp(createdFromRequest.seconds, createdFromRequest.nanoseconds),
                    deadline: new firebase.firestore.Timestamp(deadlineFromRequest.seconds, deadlineFromRequest.nanoseconds),
                })
            });
            const moreCasesExist = cases.length === 5;
            if (this._isMounted) {
                this.setState({
                    cases,
                    loadingCases: false,
                    moreCasesExist,
                    page: this.state.page - 1,
                })
            }
        });
    }

    private loadNextCases = () => {
        if (this.noMoreCasesAvailable()) {
            return;
        }

        const companyId = this.props.match.path.split('/')[2];
        const casesSearchRequest: ICasesSearchRequest = {
            companyId,
            limit: this.state.limit,
            startAfter: this.state.cases[this.state.cases.length - 1].document,
            ...this.state.selectedFilter,
        }

        const userType = this.props.userState[companyId].type;
        const userId = this.props.userState[companyId].uid;

        Api.projectsApi.searchCases(casesSearchRequest, userType, userId).then((caseDocumentSnapshots) => {
            const cases: IAugmentedCase[] = [];
            caseDocumentSnapshots.forEach((document) => {
                const data = document.data();
                const createdFromRequest = data!.created as firebase.firestore.Timestamp;
                const deadlineFromRequest = data!.deadline as firebase.firestore.Timestamp;

                cases.push({
                    id: document.id,
                    document,
                    ...document.data() as any,
                    created: new firebase.firestore.Timestamp(createdFromRequest.seconds, createdFromRequest.nanoseconds),
                    deadline: new firebase.firestore.Timestamp(deadlineFromRequest.seconds, deadlineFromRequest.nanoseconds),
                })
            });
            const moreCasesExist = cases.length === 5;
            const startingCases = this.state.startingCases;
            startingCases[this.state.page + 1] = cases[0];
            if (this._isMounted) {
                this.setState({
                    cases,
                    loadingCases: false,
                    moreCasesExist,
                    page: this.state.page + 1,
                    startingCases,
                })
            }
        });
    }

    private noMoreCasesAvailable = () => {
        return this.state.cases.length !== this.state.limit;
    }

    private makeDeadlinePretty = (date: Date): string => {
        const today = new Date();
        const todayCalendarDay = today.getDate();
        const tomorrowCalendarDay = today.getDate() + 1;

        const dateCalendarDay = date.getDate();
        const tomorrowDateCalendarDay = date.getDate() + 1;

        if (todayCalendarDay === dateCalendarDay) {
            return 'Today';
        } else if (tomorrowCalendarDay === tomorrowDateCalendarDay) {
            return 'Tomorrow';
        } else {
            const dateCalendarMonth = date.getMonth() + 1;
            const dateCalendarYear = date.getFullYear();

            return `${dateCalendarMonth}/${dateCalendarDay}/${dateCalendarYear}`;
        }
    }

    private navigateToProject(projectId: string): () => void {
        return () => {
            const postRoute = `${this.props.location.pathname}/project/${projectId}`;
            this.props.history.push(postRoute);
        }
    }

    private navigateToCreateProjectPage = () => {
        this.props.history.push(`${this.props.location.pathname}/createCase`);
    }
}

const mapStateToProps = ({ userState }: IAppState) => ({
    userState,
});

const connectedComponent = connect(mapStateToProps, undefined)(ProjectsPresentation as any);
export const Projects = withRouter(connectedComponent as any);