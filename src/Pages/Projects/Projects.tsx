import {
    IconButton,
    TableFooter,
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
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PrintIcon from '@material-ui/icons/Print';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ISlimCasesSearchRequest } from 'src/Api/Projects/projectsInterface';
import { QRCodeDisplay } from 'src/Components/QRCodeDisplay/QRCodeDisplay';
import { IQRCodeKeys } from 'src/Components/QRCodeDisplay/QRCodeDisplay.ias';
import { ShowNewInfoFromType } from 'src/Models/showNewInfoFromTypes';
import { ISlimCase } from 'src/Models/slimCase';
import { UserType } from 'src/Models/userTypes';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import Api from '../../Api/api';
import { createProjectsPresentationClasses, IProjectsPresentationProps, IProjectsPresentationState } from './Projects.ias';

export class ProjectsPresentation extends React.Component<IProjectsPresentationProps, IProjectsPresentationState> {
    public state: IProjectsPresentationState = {
        slimCases: [],
        qrCodeKeys: null,
        loadingSlimCases: true,
        moreCasesExist: true,
        page: 0,
        limit: 20,
        startingSlimCases: [],
        retrievingQRCodes: false,
    }

    // tslint:disable-next-line:variable-name
    public _isMounted: boolean;

    public async componentWillMount(): Promise<void> {
        this._isMounted = true;
        const companyId = this.props.match.path.split('/')[2];
        const slimCasesSearchRequest: ISlimCasesSearchRequest = {
            companyId,
            limit: this.state.limit,
        }

        const userType = this.props.userState[companyId].type;
        const userId = this.props.userState[companyId].uid;

        Api.projectsApi.getSlimCases(slimCasesSearchRequest, userType, userId).then((slimCaseDocumentSnapshots) => {
            const slimCases: ISlimCase[] = [];
            slimCaseDocumentSnapshots.forEach((document) => {
                slimCases.push({
                    caseId: document.id,
                    document,
                    ...document.data() as any,
                })
            });
            const moreCasesExist = slimCases.length === 5;
            if (this._isMounted) {
                this.setState({
                    slimCases,
                    loadingSlimCases: false,
                    moreCasesExist,
                    startingSlimCases: [slimCases[0]],
                })
            }
        });
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
        } = createProjectsPresentationClasses(this.props, this.state);

        const mappedProjects = this.state.slimCases.map(slimCase => {
            const companyId = this.props.match.path.split('/')[2];
            const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;
            const newInfoFromDoctor = slimCase.showNewInfoFrom === ShowNewInfoFromType.Doctor;
            const newInfoFromLab = slimCase.showNewInfoFrom === ShowNewInfoFromType.Lab;

            const shouldShowNotification = (userIsDoctor && newInfoFromLab) || (!userIsDoctor && newInfoFromDoctor);
            const newInfoCell = shouldShowNotification ? <TableCell/> : (
                <TableCell>
                    <NotificationsIcon/>
                </TableCell>
            );

            const date = new Date(slimCase.deadline);
            const prettyDeadline = this.makeDeadlinePretty(date);
            return (
                <TableRow key={slimCase.caseId} onClick={this.navigateToProject(slimCase.caseId)} className={rowStyling}>
                    <TableCell>{slimCase.name}</TableCell>
                    <TableCell>{slimCase.currentCheckpointName}</TableCell>
                    <TableCell>{prettyDeadline}</TableCell>
                    {newInfoCell}
                </TableRow>
            )
        })

        return (
            <div className={projectsContainer}>
                <Paper className={projectsPaper}>
                    <Toolbar className={projectsToolbarContainer}>
                        <Typography variant="title">
                            Cases
                        </Typography>
                        <div>
                            <Tooltip title="Print New Project QR Codes" placement="left" disableFocusListener={true}>
                                <IconButton
                                    disabled={this.state.retrievingQRCodes}
                                    aria-label="Print QR Codes"
                                    onClick={this.printQRCodes}
                                    color="secondary"
                                >
                                    <PrintIcon />
                                </IconButton>
                            </Tooltip>
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
                                    <TableCell>Case Name</TableCell>
                                    <TableCell>Current Checkpoint</TableCell>
                                    <TableCell>Case Deadline</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody className={tableBody}>
                                {mappedProjects}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4}>
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
                    </div>
                </Paper>
                {this.state.qrCodeKeys ? (
                    <QRCodeDisplay qrCodes={this.state.qrCodeKeys}/>
                ) : undefined}
            </div>
        )
    }

    private loadPreviousCases = () => {
        if (this.state.page === 0) {
            return;
        }

        const companyId = this.props.match.path.split('/')[2];
        const slimCasesSearchRequest: ISlimCasesSearchRequest = {
            companyId,
            limit: this.state.limit,
            startAt: this.state.startingSlimCases[this.state.page - 1].document,
        }

        const userType = this.props.userState[companyId].type;
        const userId = this.props.userState[companyId].uid;

        Api.projectsApi.getSlimCases(slimCasesSearchRequest, userType, userId).then((slimCaseDocumentSnapshots) => {
            const slimCases: ISlimCase[] = [];
            slimCaseDocumentSnapshots.forEach((document) => {
                slimCases.push({
                    caseId: document.id,
                    document,
                    ...document.data() as any,
                })
            });
            const moreCasesExist = slimCases.length === 5;
            if (this._isMounted) {
                this.setState({
                    slimCases,
                    loadingSlimCases: false,
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
        const slimCasesSearchRequest: ISlimCasesSearchRequest = {
            companyId,
            limit: this.state.limit,
            startAfter: this.state.slimCases[this.state.slimCases.length - 1].document,
        }

        const userType = this.props.userState[companyId].type;
        const userId = this.props.userState[companyId].uid;

        Api.projectsApi.getSlimCases(slimCasesSearchRequest, userType, userId).then((slimCaseDocumentSnapshots) => {
            const slimCases: ISlimCase[] = [];
            slimCaseDocumentSnapshots.forEach((document) => {
                slimCases.push({
                    caseId: document.id,
                    document,
                    ...document.data() as any,
                })
            });
            const moreCasesExist = slimCases.length === 5;
            const startingSlimCases = this.state.startingSlimCases;
            startingSlimCases[this.state.page + 1] = slimCases[0];
            if (this._isMounted) {
                this.setState({
                    slimCases,
                    loadingSlimCases: false,
                    moreCasesExist,
                    page: this.state.page + 1,
                    startingSlimCases,
                })
            }
        });
    }

    private noMoreCasesAvailable = () => {
        return this.state.slimCases.length !== this.state.limit;
    }

    private printQRCodes = async() => {
        const companyId = this.props.match.path.split('/')[2];

        if (this._isMounted) {
            this.setState({
                retrievingQRCodes: true,
            })
        }

        const cases = await Api.projectsApi.getNewCases(companyId);
        // tslint:disable-next-line:no-console
        console.log('cases: ', cases);
        const qrCodeKeys: IQRCodeKeys[] = cases.map((project) => {
            return {
                caseId: project.id,
                caseName: project.name,
                caseDeadline: this.makeDeadlinePretty(new Date(project.deadline)),
            }
        })

        // tslint:disable-next-line:no-console
        console.log('qrCodeKeys: ', qrCodeKeys);

        if (this._isMounted) {
            this.setState({
                qrCodeKeys,
            })
        }

        setTimeout(() => {
            if (this._isMounted) {
                this.setState({
                    retrievingQRCodes: false,
                })
            }
            window.print();
        }, 1000);
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
        this.props.history.push(`${this.props.location.pathname}/createProject`);
    }
}

const mapStateToProps = ({ userState }: IAppState) => ({
    userState,
});

const connectedComponent = connect(mapStateToProps, undefined)(ProjectsPresentation as any);
export const Projects = withRouter(connectedComponent as any);