import {
    IconButton,
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
import NotificationsIcon from '@material-ui/icons/Notifications';
import PrintIcon from '@material-ui/icons/Print';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ISlimCasesSearchRequest } from 'src/Api/Projects/projectsInterface';
import { QRCodeDisplay } from 'src/Components/QRCodeDisplay/QRCodeDisplay';
import { IQRCodeKeys } from 'src/Components/QRCodeDisplay/QRCodeDisplay.ias';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import Api from '../../Api/api';
import { createProjectsPresentationClasses, IProjectsPresentationProps, IProjectsPresentationState } from './Projects.ias';

export class ProjectsPresentation extends React.Component<IProjectsPresentationProps, IProjectsPresentationState> {
    public state: IProjectsPresentationState = {
        slimCases: [],
        qrCodeKeys: null,
    }

    public async componentWillMount(): Promise<void> {
        const companyId = this.props.match.path.split('/')[2];
        const slimCasesSearchRequest: ISlimCasesSearchRequest = {
            companyId,
            limit: 50,
        }
        Api.projectsApi.getSlimCases(slimCasesSearchRequest).then((slimCases) => {
            this.setState({
                slimCases,
            })
        });
    }

    public render() {
        const {
            rowStyling,
            projectsContainer,
            projectsToolbarContainer,
            projectsPaper,
        } = createProjectsPresentationClasses(this.props, this.state);

        const mappedProjects = this.state.slimCases.map(slimCase => {
            const companyId = this.props.match.path.split('/')[2];
            const userIsDoctor = this.props.userState[companyId].type === 'Customer';
            const newInfoFromDoctor = slimCase.showNewInfoFrom === 'Doctor';
            const newInfoFromLab = slimCase.showNewInfoFrom === 'Lab';

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
                            <Tooltip title="Print New Project QR Codes" placement="left">
                                <IconButton
                                    aria-label="Print QR Codes"
                                    onClick={this.printQRCodes}
                                    color="secondary"
                                >
                                    <PrintIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="New Case" placement="left">
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
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Case Name</TableCell>
                                <TableCell>Current Checkpoint</TableCell>
                                <TableCell>Case Deadline</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {mappedProjects}
                        </TableBody>
                    </Table>
                </Paper>
                {this.state.qrCodeKeys ? (
                    <QRCodeDisplay qrCodes={this.state.qrCodeKeys}/>
                ) : undefined}
            </div>
        )
    }

    private printQRCodes = async() => {
        const companyId = this.props.match.path.split('/')[2];

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

        this.setState({
            qrCodeKeys,
        })

        setTimeout(() => {
            window.print();
        }, 1000);
    }

    private makeDeadlinePretty = (date: Date): string => {
        const today = new Date();
        const todayCalendarDay = today.getDate() + 1;
        const tomorrowCalendarDay = today.getDate() + 2;

        const dateCalendarDay = date.getDate() + 1;
        const tomorrowDateCalendarDay = date.getDate() + 2;

        if (todayCalendarDay === dateCalendarDay) {
            return 'Today';
        } else if (tomorrowCalendarDay === tomorrowDateCalendarDay) {
            return 'Tomorrow';
        } else {
            const dateCalendarMonth = today.getMonth() + 1;
            const dateCalendarYear = today.getFullYear();

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