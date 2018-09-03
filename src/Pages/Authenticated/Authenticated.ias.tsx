import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';

// tslint:disable-next-line:no-empty-interface
export interface IAuthenticatedProps extends RouteComponentProps<{}>, WithTheme {}
// tslint:disable-next-line:no-empty-interface
export interface IAuthenticatedState {}

export const createAuthenticatedClasses = (
    props: IAuthenticatedProps,
    state: IAuthenticatedState,
) => {

    const iconContainer = css({
        paddingLeft: '12px !important',
        paddingRight: '12px !important',
    })

    const iconStyling = css({
        marginRight: '0px !important',
        fontSize: '32px !important',
    });

    const list = css({
        padding: '0 !important',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    });

    const drawerContainer = css({
        flexShrink: 0,
        width: 56,
        height: '100%',
    });

    const pageContainer = css({
        flexGrow: 1,
    });

    const authenticatedContainer = css({
        display: 'flex',
        flexDirection: 'row',
    });

    return {
        iconContainer,
        iconStyling,
        list,
        drawerContainer,
        pageContainer,
        authenticatedContainer,
    }
}