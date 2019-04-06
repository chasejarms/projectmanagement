import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { IUserSliceOfState } from 'src/Redux/Reducers/userReducer';

export interface IAuthenticatedProps extends RouteComponentProps<{}>, WithTheme {
    removeUserForCompany: (companyId: string) => void,
    userState: IUserSliceOfState;
    hasMultipleCompanies: boolean;
}
// tslint:disable-next-line:no-empty-interface
export interface IAuthenticatedState {}

export const createAuthenticatedClasses = (
    props: IAuthenticatedProps,
    state: IAuthenticatedState,
) => {

    const iconStyling = css({
        marginRight: '0px !important',
        fontSize: '32px !important',
    });

    const iconContainer = css({
        paddingLeft: '12px !important',
        paddingRight: '12px !important',
        '&:hover': {
            [`svg.${iconStyling}`]: {
                color: `${props.theme.palette.secondary.main} !important`
            },
            backgroundColor: `rgba(245, 0, 87, 0.08) !important`,
        }
    })

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

    const pageBackgroundLayerTwo = css({
        position: 'absolute',
        minHeight: '100vh',
        height: '100%',
        width: '100%',
        clipPath: 'polygon(100% 100%, 0% 100%, 0% 90, 100% 10%, 100% 100%);',
        backgroundColor: props.theme.palette.primary.main,
        zIndex: -3,
    });

    const pageBackgroundLayerThree = css({
        position: 'absolute',
        minHeight: '100vh',
        height: '100%',
        width: '100%',
        clipPath: 'polygon(100% 100%, 0% 100%, 0% 70%, 100% 10%, 100% 100%);',
        backgroundColor: props.theme.palette.primary.dark,
        zIndex: -1,
    })

    return {
        iconContainer,
        iconStyling,
        list,
        drawerContainer,
        pageContainer,
        authenticatedContainer,
        pageBackgroundLayerTwo,
        pageBackgroundLayerThree,
    }
}