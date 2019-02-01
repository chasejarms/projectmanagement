import * as React from 'react';
import {
    createUserSettingsClasses,
    IUserSettingsProps,
    IUserSettingsState,
} from './UserSettings.ias';

import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { UserType } from 'src/Models/userTypes';
import { IAppState } from 'src/Redux/Reducers/rootReducer';

export class UserSettingsPresentation extends React.Component<
    IUserSettingsProps,
    IUserSettingsState
> {
    public render() {
        const {
            userSettingsContainer,
            userSettingsPaper,
            accountSettingsTitle,
            userInformationContainer,
        } = createUserSettingsClasses(this.props, this.state);

        const companyId = this.props.location.pathname.split('/')[2];
        const user = this.props.userState[companyId];

        return (
            <div className={userSettingsContainer}>
                <Paper className={userSettingsPaper}>
                    <Typography variant="title" className={accountSettingsTitle}>Account Settings</Typography>
                    <div className={userInformationContainer}>
                        <TextField
                            disabled={true}
                            label="Full Name"
                            name="fullName"
                            value={user.fullName}
                        />
                        <TextField
                            disabled={true}
                            label="Email"
                            name="email"
                            value={user.email}
                        />
                        <FormControl>
                            <InputLabel>Role</InputLabel>
                            <Select
                                disabled={true}
                                name="userType"
                                inputProps={{
                                    id: 'role',
                                }}
                                value={user.type}
                            >
                                <MenuItem value={UserType.Admin}>Admin</MenuItem>
                                <MenuItem value={UserType.Staff}>Staff</MenuItem>
                                <MenuItem value={UserType.Doctor}>Doctor</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {/* <div className={asyncButtonContainer}>
                        <AsyncButton
                            color="secondary"
                            disabled={this.state.caseNotesSaveInProgress || !this.state.notes!.touched || this.state.initialLoadInProgress }
                            asyncActionInProgress={this.state.caseNotesSaveInProgress}
                            onClick={this.saveCaseNotes}
                        >
                            Save Case Notes
                        </AsyncButton>
                    </div> */}
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = ({ userState }: IAppState) => ({
    userState
});

const connectedComponent = connect(mapStateToProps, undefined)(UserSettingsPresentation as any);
export const UserSettings = withRouter(connectedComponent as any);
