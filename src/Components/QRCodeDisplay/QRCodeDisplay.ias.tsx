import { css } from 'emotion';
import { IDoctorUser } from 'src/Models/doctorUser';
import { IPrescriptionFormTemplate } from 'src/Models/prescription/prescriptionFormTemplate';

// tslint:disable-next-line:no-empty-interface
export interface IQRCodeDisplayState {}
// tslint:disable-next-line:no-empty-interface
export interface IQRCodeDisplayProps {
    prescriptionFormTemplate: IPrescriptionFormTemplate;
    controlValues: {
        [controlId: string]: any,
    };
    doctorUser: IDoctorUser;
    caseId: string;
}

export const createQRCodeDisplayClasses = (
    props: IQRCodeDisplayProps,
    state: IQRCodeDisplayState,
) => {
    const printableCaseInfoContainer = css({
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
        position: 'fixed',
        backgroundColor: 'white',
        top: 0,
        right: 0,
        zIndex: 99999,
        boxSizing: 'border-box',
        padding: 32,
    })

    const qrCodeContainer = css({
        position: 'absolute',
        marginTop: 8,
        marginRight: 8,
        top: 0,
        right: 0,
    })

    const individualQRCodeContainer = css({
        display: 'inline-block',
    });

    const sectionContainer = css({
        paddingTop: 32,
    });

    const controlContainer = css({
        paddingBottom: 16,
    })

    return {
        printableCaseInfoContainer,
        qrCodeContainer,
        individualQRCodeContainer,
        sectionContainer,
        controlContainer,
    };
}