import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';

// tslint:disable-next-line:no-empty-interface
export interface IPrivacyPolicyProps extends RouteComponentProps<any>, WithTheme {}
// tslint:disable-next-line:no-empty-interface
export interface IPrivacyPolicyState {}

export const createPrivacyPolicyClasses = (
    props: IPrivacyPolicyProps,
    state: IPrivacyPolicyState,
) => {
    const privacyPolicyContainer = css({
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    });

    const logoContainer = css({
        position: 'absolute',
        top: 0,
        left: 0,
        padding: 16,
    });

    const backToHomeContainer = css({
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 16,
    });

    const privacyPolicyContent = css({
        maxWidth: 800,
        overflowY: 'auto',
        paddingTop: 32,
        paddingBottom: 32,
    });

    const title = css({
        marginBottom: '40px !important',
    });

    const paragraph = css({
        marginBottom: '24px !important',
    });

    const subtitle = css({
        marginBottom: '24px !important',
    });

    const contactUsSpan = css({
        color: props.theme.palette.primary.main,
        '&:hover': {
            cursor: 'pointer',
        }
    });

    return {
        privacyPolicyContainer,
        logoContainer,
        backToHomeContainer,
        privacyPolicyContent,
        title,
        paragraph,
        subtitle,
        contactUsSpan,
    };
}