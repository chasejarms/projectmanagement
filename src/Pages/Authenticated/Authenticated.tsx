import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    Tooltip,
} from '@material-ui/core';
import { withTheme } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListIcon from '@material-ui/icons/List';
import NoteIcon from '@material-ui/icons/Note';
import PeopleIcon from '@material-ui/icons/People';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { removeUserForCompany } from 'src/Redux/ActionCreators/userActionCreators';
import Api from '../../Api/api';
import { CaseNotesTemplate } from '../CaseNotesTemplate/CaseNotesTemplate';
import { Project } from '../Project/Project';
import { ProjectCreation } from '../ProjectCreation/ProjectCreation';
import { Projects } from '../Projects/Projects';
import { Users } from '../Users/Users';
import { Workflow } from '../Workflow/Workflow';
import { createAuthenticatedClasses, IAuthenticatedProps, IAuthenticatedState } from './Authenticated.ias';

export class AuthenticatedPresentation extends React.Component<IAuthenticatedProps, IAuthenticatedState> {
    public render() {
        const {
            iconStyling,
            iconContainer,
            list,
            drawerContainer,
            pageContainer,
            authenticatedContainer,
            pageBackgroundLayerTwo,
            pageBackgroundLayerThree,
        } = createAuthenticatedClasses(this.props, this.state);

        return (
            <div className={authenticatedContainer}>
                <div className={drawerContainer}>
                    <Drawer
                        variant="permanent"
                        open={true}
                    >
                        <List className={list}>
                            <div>
                                <Tooltip title="Cases" placement="right" disableFocusListener={true}>
                                    <ListItem
                                        button={true}
                                        className={iconContainer}
                                        onClick={this.navigateToProjects}
                                    >
                                        <ListItemIcon>
                                            <AssignmentIcon className={iconStyling}/>
                                        </ListItemIcon>
                                    </ListItem>
                                </Tooltip>
                                <Tooltip title="Users" placement="right" disableFocusListener={true}>
                                    <ListItem
                                        button={true}
                                        className={iconContainer}
                                        onClick={this.navigateToUsers}
                                    >
                                        <ListItemIcon>
                                            <PeopleIcon className={iconStyling}/>
                                        </ListItemIcon>
                                    </ListItem>
                                </Tooltip>
                                <Tooltip title="Workflow" placement="right" disableFocusListener={true}>
                                    <ListItem
                                        button={true}
                                        className={iconContainer}
                                        onClick={this.navigateToWorkflow}
                                    >
                                        <ListItemIcon>
                                            <ListIcon className={iconStyling}/>
                                        </ListItemIcon>
                                    </ListItem>
                                </Tooltip>
                                <Tooltip title="Case Notes Template" placement="right" disableFocusListener={true}>
                                    <ListItem
                                        button={true}
                                        className={iconContainer}
                                        onClick={this.navigateToCaseNotesTemplate}
                                    >
                                        <ListItemIcon>
                                            <NoteIcon className={iconStyling}/>
                                        </ListItemIcon>
                                    </ListItem>
                                </Tooltip>
                            </div>
                            <div>
                                <Divider/>
                                <Tooltip title="User Settings" placement="right">
                                    <ListItem
                                        button={true}
                                        className={iconContainer}
                                        onClick={this.navigateToUserSettings}
                                    >
                                        <ListItemIcon>
                                            <AccountBoxIcon className={iconStyling}/>
                                        </ListItemIcon>
                                    </ListItem>
                                </Tooltip>
                                <Tooltip title="Logout" placement="right" disableFocusListener={true}>
                                    <ListItem
                                        button={true}
                                        className={iconContainer}
                                        onClick={this.logout}
                                    >
                                        <ListItemIcon>
                                            <ExitToAppIcon className={iconStyling}/>
                                        </ListItemIcon>
                                    </ListItem>
                                </Tooltip>
                            </div>
                        </List>
                    </Drawer>
                </div>
                <div className={pageBackgroundLayerTwo}/>
                <div className={pageBackgroundLayerThree}/>
                <div className={pageContainer}>
                    <Switch>
                        <Route
                            path={this.props.match.url + ''}
                            exact={true}
                            component={Projects}
                        />
                        <Route
                            path={this.props.match.url + '/project/:projectId'}
                            exact={true}
                            component={Project}
                        />
                        <Route
                            path={this.props.match.url + '/users'}
                            exact={true}
                            component={Users}
                        />
                        <Route
                            path={this.props.match.url + '/workflow'}
                            exact={true}
                            component={Workflow}
                        />
                        <Route
                            path={this.props.match.url + '/createProject'}
                            exact={true}
                            component={ProjectCreation}
                        />
                        <Route
                            path={this.props.match.url + '/caseNotesTemplate'}
                            exact={true}
                            component={CaseNotesTemplate}
                        />
                    </Switch>
                </div>
            </div>
        )
    }

    private navigateToProjects = () => {
        const { companyName } = this.props.match.params as any;
        this.props.history.push(`/company/${companyName}`);
    }

    private navigateToUsers = () => {
        const { companyName } = this.props.match.params as any;
        this.props.history.push(`/company/${companyName}/users`);
    }

    private navigateToCaseNotesTemplate = () => {
        const { companyName } = this.props.match.params as any;
        this.props.history.push(`/company/${companyName}/caseNotesTemplate`);
    }

    private navigateToUserSettings = () => {
        const { companyName } = this.props.match.params as any;
        this.props.history.push(`/company/${companyName}/userSettings`);
    }

    private logout = async() => {
        const { companyName } = this.props.match.params as any;
        await Api.authenticationApi.logout();
        this.props.removeUserForCompany(companyName)
        this.props.history.push('/login');
    }

    private navigateToWorkflow = () => {
        const { companyName } = this.props.match.params as any;
        this.props.history.push(`/company/${companyName}/workflow`);
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    removeUserForCompany: (companyId: string) => {
        dispatch(removeUserForCompany(companyId));
    },
})

const connectedComponent = connect(undefined, mapDispatchToProps)(AuthenticatedPresentation as any);
export const Authenticated = withRouter(withTheme() (connectedComponent as any) as any);