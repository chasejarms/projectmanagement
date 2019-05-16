import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface IHomeProps extends WithTheme {}
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

    return {
        dentalLabCloseUpContainer,
        topSectionContainer,
        navigationBar,
        dentalLabCloseUpContent,
        mainTopSectionText,
        seeFeaturesButton,
    };
}