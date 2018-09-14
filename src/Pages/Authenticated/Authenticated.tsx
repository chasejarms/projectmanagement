import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
} from '@material-ui/core';
import { withTheme } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListIcon from '@material-ui/icons/List';
import PeopleIcon from '@material-ui/icons/People';
import * as React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { MyProjects } from '../MyProjects/MyProjects'
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
                                <ListItem
                                    button={true}
                                    className={iconContainer}
                                    onClick={this.navigateToProjects}
                                >
                                    <ListItemIcon>
                                        <AssignmentIcon className={iconStyling}/>
                                    </ListItemIcon>
                                </ListItem>
                                <ListItem
                                    button={true}
                                    className={iconContainer}
                                    onClick={this.navigateToUsers}
                                >
                                    <ListItemIcon>
                                        <PeopleIcon className={iconStyling}/>
                                    </ListItemIcon>
                                </ListItem>
                                <ListItem
                                    button={true}
                                    className={iconContainer}
                                    onClick={this.navigateToWorkflow}
                                >
                                    <ListItemIcon>
                                        <ListIcon className={iconStyling}/>
                                    </ListItemIcon>
                                </ListItem>
                            </div>
                            <div>
                                <Divider/>
                                <ListItem
                                    button={true}
                                    className={iconContainer}
                                    onClick={this.navigateToUserSettings}
                                >
                                    <ListItemIcon>
                                        <AccountBoxIcon className={iconStyling}/>
                                    </ListItemIcon>
                                </ListItem>
                                <ListItem
                                    button={true}
                                    className={iconContainer}
                                    onClick={this.logout}
                                >
                                    <ListItemIcon>
                                        <ExitToAppIcon className={iconStyling}/>
                                    </ListItemIcon>
                                </ListItem>
                            </div>
                        </List>
                    </Drawer>
                </div>
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
                            path={this.props.match.url + '/myProjects'}
                            exact={true}
                            component={MyProjects}
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

    private navigateToUserSettings = () => {
        const { companyName } = this.props.match.params as any;
        this.props.history.push(`/company/${companyName}/userSettings`);
    }

    private logout = () => {
        this.props.history.push('/login');
    }

    private navigateToWorkflow = () => {
        const { companyName } = this.props.match.params as any;
        this.props.history.push(`/company/${companyName}/workflow`);
    }
}

export const Authenticated = withRouter(withTheme() (AuthenticatedPresentation));