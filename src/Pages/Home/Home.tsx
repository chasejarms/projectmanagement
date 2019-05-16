import {
    Button,
    Typography,
    withTheme,
} from '@material-ui/core';
import * as React from 'react';
import { createHomeClasses, IHomeProps, IHomeState } from './Home.ias';

// tslint:disable-next-line:no-var-requires
const dentalLabCloseUpSrc = require('./dental-lab-closeup.png');

export class HomePresentation extends React.Component<IHomeProps, IHomeState> {
    public render() {
        const {
            dentalLabCloseUpContainer,
            topSectionContainer,
            navigationBar,
            dentalLabCloseUpContent,
            mainTopSectionText,
            seeFeaturesButton,
        } = createHomeClasses(this.props, this.state);

        return (
            <div>
                <div className={topSectionContainer}>
                    <div style={{
                        backgroundImage: `url(${dentalLabCloseUpSrc})`
                    }} className={dentalLabCloseUpContainer}>
                        <div className={navigationBar}>
                            <Button variant="contained" color="secondary">Login</Button>
                        </div>
                        <div className={dentalLabCloseUpContent}>
                            <Typography variant="h2" className={mainTopSectionText}>
                                Visual Dental Lab Management
                            </Typography>
                            <Button variant="contained" color="secondary" className={seeFeaturesButton}>See Features</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export const Home = withTheme()(HomePresentation);