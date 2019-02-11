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
import { RouteGuard } from 'src/Components/RouteGuard/RouteGuard';
import { UserType } from 'src/Models/userTypes';
import { removeUserForCompany } from 'src/Redux/ActionCreators/userActionCreators';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import Api from '../../Api/api';
import { CaseCreation } from '../CaseCreation/CaseCreation';
import { CaseNotesTemplate } from '../CaseNotesTemplate/CaseNotesTemplate';
import { Project } from '../Project/Project';
import { Projects } from '../Projects/Projects';
import { Users } from '../Users/Users';
import { UserSettings } from '../UserSettings/UserSettings';
import { Workflow } from '../Workflow/Workflow';
import {
    createAuthenticatedClasses,
    IAuthenticatedProps,
    IAuthenticatedState,
} from './Authenticated.ias';

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

        const companyId = this.props.location.pathname.split('/')[2];

        const userIsNotAdmin = this.props.userState[companyId].type !== UserType.Admin;

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
                                {userIsNotAdmin ? undefined : (
                                    <div>
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
                                )}
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
                        <RouteGuard
                            mustHaveRole={[UserType.Admin]}
                            path={this.props.match.url + '/users'}
                            component={Users}
                        />
                        <RouteGuard
                            mustHaveRole={[UserType.Admin]}
                            path={this.props.match.url + '/workflow'}
                            component={Workflow as any}
                        />
                        <Route
                            path={this.props.match.url + '/createCase'}
                            exact={true}
                            component={CaseCreation}
                        />
                        <RouteGuard
                            mustHaveRole={[UserType.Admin]}
                            path={this.props.match.url + '/caseNotesTemplate'}
                            component={CaseNotesTemplate as any}
                        />
                        <Route
                            path={this.props.match.url + '/userSettings'}
                            exact={true}
                            component={UserSettings}
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

const mapStateToProps = ({ userState }: IAppState) => ({
    userState
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    removeUserForCompany: (companyId: string) => {
        dispatch(removeUserForCompany(companyId));
    },
})

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthenticatedPresentation as any) as any);
export const Authenticated = withTheme() (connectedComponent as any) as any;