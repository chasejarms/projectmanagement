import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { FormControlState } from 'src/Classes/formControlState';
import { IUserSliceOfState } from 'src/Redux/Reducers/userReducer';

// tslint:disable-next-line:no-empty-interface
export interface IUserSettingsState {
    firstPassword: FormControlState<string>;
    secondPassword: FormControlState<string>;
    updatingUserPassword: boolean;
}

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

    const resetPasswordButtonContainer = css({
        display: 'flex',
        alignItems: 'flex-end',
    });

    const resetPasswordContainer = css({
        paddingTop: 32,
    });

    const resetPasswordNotTitleContainer = css({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridColumnGap: 32,
    });

    const resetPasswordTitle = css({
        paddingBottom: 32,
    });

    return {
        userSettingsContainer,
        userSettingsPaper,
        accountSettingsTitle,
        userInformationContainer,
        resetPasswordButtonContainer,
        resetPasswordContainer,
        resetPasswordNotTitleContainer,
        resetPasswordTitle,
    };
}