import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';
import { withTheme } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DescriptionIcon from '@material-ui/icons/Description';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListIcon from '@material-ui/icons/List';
import PeopleIcon from '@material-ui/icons/People';
import WorkIcon from '@material-ui/icons/Work';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RouteGuard } from 'src/Components/RouteGuard/RouteGuard';
import { UserType } from 'src/Models/userTypes';
import { removeUserForCompany } from 'src/Redux/ActionCreators/userActionCreators';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import Api from '../../Api/api';
import { Logo } from '../../Components/Logo/Logo';
import { CaseCreation } from '../CaseCreation/CaseCreation';
import { NotFound } from '../NotFound/NotFound';
import { PrescriptionBuilder } from '../PrescriptionBuilder/PrescriptionBuilder';
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
            listItemIcon,
            logoContainer,
        } = createAuthenticatedClasses(this.props, this.state);

        const companyId = this.props.location.pathname.split('/')[2];

        const userIsNotAdmin = this.props.userState[companyId].type !== UserType.Admin;

        return (
            <div className={authenticatedContainer}>
                {/** Do not remove the authenticated-navigation-drawer-container class. It is used by the qr code display component css */}
                <div className={`${drawerContainer} authenticated-navigation-drawer-container`}>
                    <Drawer
                        variant="permanent"
                        open={true}
                    >
                        <List className={list}>
                            <div>
                                <div className={logoContainer}>
                                    <Logo color="blue" width={150}/>
                                </div>
                                <ListItem
                                    button={true}
                                    className={iconContainer}
                                    onClick={this.navigateToProjects}
                                >
                                    <ListItemIcon className={listItemIcon}>
                                        <AssignmentIcon className={iconStyling}/>
                                    </ListItemIcon>
                                    <ListItemText>Cases</ListItemText>
                                </ListItem>
                                {userIsNotAdmin ? undefined : (
                                    <div>
                                        <ListItem
                                            button={true}
                                            className={iconContainer}
                                            onClick={this.navigateToUsers}
                                        >
                                            <ListItemIcon className={listItemIcon}>
                                                <PeopleIcon className={iconStyling}/>
                                            </ListItemIcon>
                                            <ListItemText>Users</ListItemText>
                                        </ListItem>
                                        <ListItem
                                            button={true}
                                            className={iconContainer}
                                            onClick={this.navigateToWorkflow}
                                        >
                                            <ListItemIcon className={listItemIcon}>
                                                <ListIcon className={iconStyling}/>
                                            </ListItemIcon>
                                            <ListItemText>Workflow</ListItemText>
                                        </ListItem>
                                        <ListItem
                                            button={true}
                                            className={iconContainer}
                                            onClick={this.navigateToPrescriptionBuilder}
                                        >
                                            <ListItemIcon className={listItemIcon}>
                                                <DescriptionIcon className={iconStyling}/>
                                            </ListItemIcon>
                                            <ListItemText>Prescription</ListItemText>
                                        </ListItem>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Divider/>
                                {this.props.hasMultipleCompanies ? (
                                    <ListItem
                                        button={true}
                                        className={iconContainer}
                                        onClick={this.navigateToCompanySelection}
                                    >
                                        <ListItemIcon className={listItemIcon}>
                                            <WorkIcon className={iconStyling}/>
                                        </ListItemIcon>
                                        <ListItemText>Companies</ListItemText>
                                    </ListItem>
                                ) : undefined}
                                <ListItem
                                    button={true}
                                    className={iconContainer}
                                    onClick={this.navigateToUserSettings}
                                >
                                    <ListItemIcon className={listItemIcon}>
                                        <AccountBoxIcon className={iconStyling}/>
                                    </ListItemIcon>
                                    <ListItemText>Settings</ListItemText>
                                </ListItem>
                                <ListItem
                                    button={true}
                                    className={iconContainer}
                                    onClick={this.logout}
                                >
                                    <ListItemIcon className={listItemIcon}>
                                        <ExitToAppIcon className={iconStyling}/>
                                    </ListItemIcon>
                                    <ListItemText>Logout</ListItemText>
                                </ListItem>
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
                            component={Project}
                            exact={true}
                        />
                        <RouteGuard
                            mustHaveRole={[UserType.Admin]}
                            path={this.props.match.url + '/users'}
                            component={Users}
                            exact={true}
                        />
                        <RouteGuard
                            mustHaveRole={[UserType.Admin]}
                            path={this.props.match.url + '/workflow'}
                            component={Workflow as any}
                            exact={true}
                        />
                        <Route
                            path={this.props.match.url + '/createCase'}
                            exact={true}
                            component={CaseCreation}
                        />
                        <RouteGuard
                            mustHaveRole={[UserType.Admin]}
                            path={this.props.match.url + '/prescriptionBuilder'}
                            component={PrescriptionBuilder as any}
                            exact={true}
                        />
                        <Route
                            path={this.props.match.url + '/userSettings'}
                            exact={true}
                            component={UserSettings}
                        />
                        <Route
                            component={NotFound}
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

    private navigateToPrescriptionBuilder = () => {
        const { companyName } = this.props.match.params as any;
        this.props.history.push(`/company/${companyName}/prescriptionBuilder`);
    }

    private navigateToUserSettings = () => {
        const { companyName } = this.props.match.params as any;
        this.props.history.push(`/company/${companyName}/userSettings`);
    }

    private navigateToCompanySelection = () => {
        const { companyName } = this.props.match.params as any;
        const authUserId = this.props.userState[companyName].authUserId;
        this.props.history.push(`/companySelection?authUserId=${authUserId}`);
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

const mapStateToProps = ({
    userState,
    authenticatedUIState,
}: IAppState) => ({
    userState,
    hasMultipleCompanies: authenticatedUIState.hasMultipleCompanies,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    removeUserForCompany: (companyId: string) => {
        dispatch(removeUserForCompany(companyId));
    },
})

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthenticatedPresentation as any) as any);
export const Authenticated = withTheme() (connectedComponent as any) as any;