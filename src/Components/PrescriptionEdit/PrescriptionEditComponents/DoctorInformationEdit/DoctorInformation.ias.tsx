import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface IDoctorInformationEditProps {
    disabled: boolean;
}
// tslint:disable-next-line:no-empty-interface
export interface IDoctorInformationEditState {}

export const createDoctorInformationEditClasses = (
    props: IDoctorInformationEditProps,
    state: IDoctorInformationEditState,
) => {
    const cityStateZipContainer = css({
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridColumnGap: 16,
    })

    return {
        cityStateZipContainer,
    }
}