import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';

// tslint:disable-next-line:no-empty-interface
export interface IHomeProps extends WithTheme, RouteComponentProps<any> {}
// tslint:disable-next-line:no-empty-interface
export interface IHomeState {}

export const createHomeClasses = (
    props: IHomeProps,
    state: IHomeState,
) => {
    // tslint:disable-next-line:no-console
    console.log(props);

    const dentalLabCloseUpContainer = css({
        height: '100vh',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
    });

    const topSectionContainer = css({
        position: 'relative',
    });

    const navigationBar = css({
        padding: 16,
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        boxSizing: 'border-box',
        position: 'absolute',
        top: '0',
    });

    const dentalLabCloseUpContent = css({
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    });

    const mainTopSectionText = css({
        color: 'white !important',
        maxWidth: 800,
        textAlign: 'center',
    });

    const seeFeaturesButton = css({
        marginTop: `36px !important`,
    });

    const featuresSection = css({
        display: 'grid',
        gridGap: 32,
        paddingTop: 64,
        paddingBottom: 64,
        justifyItems: 'center',
    });

    const featureContainer = css({
        display: 'flex',
        flexDirection: 'row',
    });

    const featureIconContainer = css({
        width: 80,
        height: 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        backgroundColor: props.theme.palette.primary.main,
    });

    const featureDescriptionContainer = css({
        marginLeft: 40,
        display: 'flex',
        flexDirection: 'column',
    });

    const iconStyling = css({
        color: 'white',
        fontSize: '48px !important',
    });

    const headlineText = css({
        fontWeight: '900 !important' as any,
    });

    const subtitleText = css({
        width: 240,
    });

    const footerSection = css({
        backgroundColor: '#242e44',
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    });

    const footerText = css({
        color: '#f9f9f9 !important',
    });

    return {
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
    };
}