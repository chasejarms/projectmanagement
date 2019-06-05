import * as React from 'react';
import { createLogoClasses, ILogoProps, ILogoState } from './Logo.ias';

// tslint:disable-next-line:no-var-requires
const logoInBlack = require('./shentaro-logo-black.png');
// tslint:disable-next-line:no-var-requires
const logoInWhite = require('./shentaro-logo-white.png');
// tslint:disable-next-line:no-var-requires
const logoInBlue = require('./shentaro-logo.png');

export class Logo extends React.Component<ILogoProps, ILogoState> {
    public render() {
        const {
            logoContainerClasses,
        } = createLogoClasses(this.props, this.state);
        const logoSrc = this.props.color === 'white' ? logoInWhite : this.props.color === 'black' ? logoInBlack : logoInBlue;
        return (
            <div className={logoContainerClasses} style={{
                backgroundImage: `url(${logoSrc})`
            }}/>
        )
    }
}