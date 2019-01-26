import { css } from 'emotion';
import { RouteComponentProps } from "react-router";
import { IQRCodeKeys } from 'src/Components/QRCodeDisplay/QRCodeDisplay.ias';
import { IUserSliceOfState } from 'src/Redux/Reducers/userReducer';
import { ISlimCase } from '../../Models/slimCase';

export interface IProjectsPresentationProps extends RouteComponentProps<{}> {
    userState: IUserSliceOfState;
}

// tslint:disable-next-line:no-empty-interface
export interface IProjectsPresentationState {
    slimCases: ISlimCase[];
    qrCodeKeys: IQRCodeKeys[] | null;
    loadingSlimCases: boolean;
    moreCasesExist: boolean;
}

export const createProjectsPresentationClasses = (
    props: IProjectsPresentationProps,
    state: IProjectsPresentationState,
) => {
    const rowStyling = css({
        cursor: 'pointer',
        flexShrink: 0,
        '&:hover': {
            backgroundColor: '#f5f5f5'
        },
    });

    const projectsContainer = css({
        height: '100vh',
        padding: 32,
        boxSizing: 'border-box',
    });

    const fabButton = css({
        position: 'absolute',
        bottom: 16,
        right: 16,
    });

    const projectsToolbarContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    });

    const projectsPaper = css({
        maxHeight: '100%',
        flexDirection: 'column',
        display: 'flex',
    });

    const tableBody = css({
        overflowY: 'auto',
    });

    const table = css({
        display: 'flex',
    });

    const tableContainer = css({
        display: 'block',
        overflowY: 'scroll',
    });

    const hiddenDiv = css({
        visibility: 'hidden',
    });

    const arrowContainer = css({
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    });

    return {
        rowStyling,
        projectsContainer,
        fabButton,
        projectsToolbarContainer,
        projectsPaper,
        tableBody,
        table,
        tableContainer,
        hiddenDiv,
        arrowContainer,
    };
}