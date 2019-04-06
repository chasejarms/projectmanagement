import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IDoctorUser } from 'src/Models/doctorUser';
import { IDoctorInformationTemplateControl } from 'src/Models/prescription/controls/doctorInformationTemplateControl';
import { IUserSliceOfState } from 'src/Redux/Reducers/userReducer';

export interface IDoctorInformationEditPropsFromParent {
    disabled: boolean;
    userState: IUserSliceOfState;
    updateControlValueActionCreator: (controlId: string, value: any) => any;
    control: IDoctorInformationTemplateControl;
    controlValue: any;
}

export interface IDoctorInformationEditProps extends RouteComponentProps<{}>, IDoctorInformationEditPropsFromParent {
    updateControlValue: (controlId: string, value: any) => void;
}

export interface IDoctorInformationEditState {
    doctorSearchValue: string;
    potentialDoctors: IDoctorUser[];
    selectedDoctorInformation: IDoctorUser | null;
    popperIsOpen: boolean;
}

export const createDoctorInformationEditClasses = (
    props: IDoctorInformationEditProps,
    state: IDoctorInformationEditState,
) => {
    const cityStateZipContainer = css({
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridColumnGap: 16,
    });

    const potentialDoctorsPaper = css({
        marginTop: 8,
    });

    const doctorInformationContainer = css({
        display: 'grid',
        gridGap: 8,
    })

    return {
        cityStateZipContainer,
        potentialDoctorsPaper,
        doctorInformationContainer,
    }
}