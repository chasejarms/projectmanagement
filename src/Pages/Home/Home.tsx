import {
    Button,
    Typography,
    withTheme,
} from '@material-ui/core';
import AttachmentIcon from '@material-ui/icons/Attachment';
import DescriptionIcon from '@material-ui/icons/Description';
import PersonIcon from '@material-ui/icons/Person';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import * as React from 'react';
import { withRouter } from 'react-router';
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
            featuresSection,
            featureContainer,
            featureIconContainer,
            featureDescriptionContainer,
            iconStyling,
            headlineText,
            subtitleText,
            footerSection,
            footerText,
        } = createHomeClasses(this.props, this.state);

        const features = [
            {
                icon: <PersonIcon className={iconStyling}/>,
                headline: 'DOCTOR PORTAL',
                subtitle: 'Doctors can enter case information and track case progress online.',
            },
            {
                icon: <TrackChangesIcon className={iconStyling}/>,
                headline: 'QR CODE TRACKING',
                subtitle: 'Know where every case is at throughout your entire workflow.'
            },
            {
                icon: <DescriptionIcon className={iconStyling}/>,
                headline: 'CUSTOMIZED PRESCRIPTIONS',
                subtitle: 'Easily customize your prescription to fit your company\'s needs',
            },
            {
                icon: <AttachmentIcon className={iconStyling}/>,
                headline: 'UPLOAD FILES',
                subtitle: 'Quickly upload and manage case files.',
            }
        ]

        return (
            <div>
                <div className={topSectionContainer}>
                    <div style={{
                        backgroundImage: `url(${dentalLabCloseUpSrc})`
                    }} className={dentalLabCloseUpContainer}>
                        <div className={navigationBar}>
                            <Button variant="contained" color="secondary" onClick={this.navigateToLogin}>Login</Button>
                        </div>
                        <div className={dentalLabCloseUpContent}>
                            <Typography variant="h2" className={mainTopSectionText}>
                                Visual Dental Lab Management
                            </Typography>
                            <Button variant="contained" color="secondary" className={seeFeaturesButton}>Explore Features</Button>
                        </div>
                    </div>
                </div>
                <div className={featuresSection}>
                    {features.map((feature, index) => {
                        return (
                            <div className={featureContainer} key={index}>
                                <div className={featureIconContainer}>
                                    {feature.icon}
                                </div>
                                <div className={featureDescriptionContainer}>
                                    <Typography variant="subtitle1" className={headlineText} color="primary">
                                        {feature.headline}
                                    </Typography>
                                    <Typography variant="subtitle2" className={subtitleText} color="textSecondary">
                                        {feature.subtitle}
                                    </Typography>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className={footerSection}>
                    <Typography className={footerText}>Shentaro - All Rights Reserved 2019</Typography>
                </div>
            </div>
        )
    }

    private navigateToLogin = (): void => {
        this.props.history.push('login');
    }
}

export const Home = withRouter(withTheme()(HomePresentation as any) as any);