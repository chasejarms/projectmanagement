import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface IQRCodeDisplayState {}
// tslint:disable-next-line:no-empty-interface
export interface IQRCodeDisplayProps {
    caseId: string;
    caseName: string;
    caseDeadline: string;
}

export const createQRCodeDisplayClasses = (
    props: IQRCodeDisplayProps,
    state: IQRCodeDisplayState,
) => {
    const qrCodesContainer = css({
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
        position: 'fixed',
        backgroundColor: 'white',
        top: 0,
        right: 0,
        zIndex: 99999,
        boxSizing: 'border-box',
        padding: 16,
    })

    const qrCodeContainer = css({
        display: 'grid',
        gridRowGap: 8,
        textAlign: 'center',
        width: 128,
    })

    return {
        qrCodesContainer,
        qrCodeContainer,
    };
}