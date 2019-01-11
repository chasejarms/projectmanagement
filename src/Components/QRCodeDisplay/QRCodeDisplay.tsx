import {
    Typography,
} from '@material-ui/core';
import * as QRCode from 'qrcode.react';
import * as React from 'react';
import './QRCodeDisplay.css';
import { createQRCodeDisplayClasses, IQRCodeDisplayProps, IQRCodeDisplayState } from './QRCodeDisplay.ias';

export class QRCodeDisplay extends React.Component<IQRCodeDisplayProps, IQRCodeDisplayState> {
    public render() {
        const {
            qrCodesContainer,
            qrCodeContainer,
        } = createQRCodeDisplayClasses(
            this.props,
            this.state,
        )

        return (
            <div className={`${qrCodesContainer} qr-code-display`}>
                {this.props.qrCodes.map(({
                    caseName,
                    caseDeadline,
                    caseId,
                }) => {
                    return (
                        <div className={qrCodeContainer} key={caseId}>
                            <Typography variant="body1">
                                {caseName}
                            </Typography>
                            <Typography variant="body1">
                                {caseDeadline}
                            </Typography>
                            <QRCode size={128} value={caseId}/>
                        </div>
                    )
                })}
            </div>
        )
    }
}