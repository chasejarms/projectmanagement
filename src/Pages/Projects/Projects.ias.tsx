import { css } from 'emotion';
import { RouteComponentProps } from "react-router";
import { IDoctorUser } from 'src/Models/doctorUser';
import { IUserSliceOfState } from 'src/Redux/Reducers/userReducer';
import { ICaseFilter } from '../../Models/caseFilter/caseFilter';
import { ISlimCase } from '../../Models/slimCase';
import { IWorkflowCheckpoint } from '../../Models/workflow';

export interface IProjectsPresentationProps extends RouteComponentProps<{}> {
    userState: IUserSliceOfState;
}

// tslint:disable-next-line:no-empty-interface
export interface IProjectsPresentationState {
    slimCases: ISlimCase[];
    loadingSlimCases: boolean;
    moreCasesExist: boolean;
    page: number;
    limit: number;
    startingSlimCases: ISlimCase[];
    retrievingQRCodes: boolean;
    showFilterCasesDialog: boolean;
    selectedFilter: ICaseFilter;
    dialogDisplayFilter: ICaseFilter;
    doctorSearchValue: string;
    potentialDoctors: IDoctorUser[];
    selectedDoctorInformation: IDoctorUser | null;
    selectedFilterCheckpoints: Set<string>;
    workflowCheckpoints: IWorkflowCheckpoint[];
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

    const nameAndFilterIconContainer = css({
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gridGap: 16,
    });

    const gridNameContainer = css({
        marginTop: 12,
    });

    const filterCasesDialogActionButtons = css({
        display: 'flex',
        justifyContent: 'space-between',
    });

    const rowRadioGroup = css({
        display: 'flex',
        flexDirection: 'row',
    });

    const dialogContent = css({
        display: 'grid',
        gridRowGap: 8,
    });

    const doctorSearchContainer = css({
        marginTop: 22,
        width: 400,
        display: 'grid',
        gridGap: 16,
        marginLeft: 16,
    });

    const doctorContainer = css({
        display: 'flex',
        justifyContent: 'start',
    });

    const selectedDoctorContainer = css({
        marginLeft: 16,
        marginTop: 30,
    });

    const checkpointsContainer = css({
        display: 'flex',
        justifyContent: 'start',
    });

    const checkpointOptionsAndSelectedOptionsContainer = css({
        display: 'grid',
        gridTemplateColumns: '300px 300px',
        gridGap: 16,
    });

    const selectedCheckpointsContainer = css({
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 32,
        paddingLeft: 8,
    });

    const selectedCheckpointContainer = css({
        marginTop: 5,
    });

    const allSelectedCheckpointsContainer = css({
        marginTop: 28,
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
        nameAndFilterIconContainer,
        gridNameContainer,
        filterCasesDialogActionButtons,
        rowRadioGroup,
        dialogContent,
        doctorSearchContainer,
        doctorContainer,
        selectedDoctorContainer,
        checkpointsContainer,
        checkpointOptionsAndSelectedOptionsContainer,
        selectedCheckpointsContainer,
        selectedCheckpointContainer,
        allSelectedCheckpointsContainer,
    };
}