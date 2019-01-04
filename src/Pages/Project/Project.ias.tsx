import { Theme, WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import { FormControlState } from 'src/Classes/formControlState';
import { ICheckpoint } from 'src/Models/checkpoint';
// import { ICase } from '../../Models/case';

// tslint:disable-next-line:no-empty-interface
export interface IProjectPresentationProps extends RouteComponentProps<{}>, WithTheme {}

export interface IProjectPresentationState {
    caseName: FormControlState<string>;
    caseDeadline: FormControlState<Date>;
    notes: FormControlState<string>;
    projectInformationIsLoading: boolean;
    attachmentUrls: string[];
    checkpoints: ICheckpoint[] | null;
    open: boolean;
    caseId: string;
    updateCaseInformationInProgress: boolean;
}

export const createProjectPresentationClasses = (
    props: IProjectPresentationProps,
    state: IProjectPresentationState,
    theme: Theme,
) => {
    const projectContainer = css({
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 32,
        paddingLeft: 32,
        paddingBottom: 32,
    })

    const evenPaper = css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        marginRight: 32,
        padding: 16,
        paddingTop: 0,
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
        justifyContent: 'space-between',
    });

    const secondPaper = css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        marginRight: 32,
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
    });

    const tabs = css({
        flexBasis: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    })

    const tabsContentContainer = css({
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    });

    const fieldSpacing = css({
        marginBottom: 16,
        flexGrow: 1,
    });

    const selectedTab = css({
        color: theme.palette.primary.main,
    })

    const nonSelectedTab = css({
        color: 'white',
    });

    const halfWidthProjectContainer = css({
        flex: 1,
    });

    const attachmentButtonsContainer = css({
        padding: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    });

    const seeAttachmentsButton = css({
        marginRight: 8,
    });

    const workflowToolbar = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    });

    const qrCodeButtonContainer = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    });

    const addAttachmentButton = css({
        position: 'relative',
        overflow: 'hidden',
    });

    const addAttachmentInput = css({
        position: 'absolute',
        width: '100%',
        height: '100%',
        paddingTop: 100,
    });

    const qrCodeButton = css({
        marginLeft: 8,
    });

    const caseInformationToolbar = css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0,
    });

    return {
        projectContainer,
        tabs,
        tabsContentContainer,
        selectedTab,
        nonSelectedTab,
        evenPaper,
        secondPaper,
        fieldSpacing,
        halfWidthProjectContainer,
        attachmentButtonsContainer,
        seeAttachmentsButton,
        workflowToolbar,
        qrCodeButtonContainer,
        addAttachmentButton,
        addAttachmentInput,
        qrCodeButton,
        caseInformationToolbar,
    };
}