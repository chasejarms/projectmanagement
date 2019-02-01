import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IUserSliceOfState } from 'src/Redux/Reducers/userReducer';

// tslint:disable-next-line:no-empty-interface
export interface IUserSettingsState {}

// tslint:disable-next-line:no-empty-interface
export interface IUserSettingsProps extends RouteComponentProps<{}> {
    userState: IUserSliceOfState;
}

export const createUserSettingsClasses = (
    props: IUserSettingsProps,
    state: IUserSettingsState,
) => {
    const userSettingsContainer = css({
        height: '100vh',
        padding: 32,
        boxSizing: 'border-box',
    });

    const userSettingsPaper = css({
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
    });

    const accountSettingsTitle = css({
        paddingBottom: 32,
    });

    const userInformationContainer = css({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridColumnGap: 32,
    });

    return {
        userSettingsContainer,
        userSettingsPaper,
        accountSettingsTitle,
        userInformationContainer,
    };
}