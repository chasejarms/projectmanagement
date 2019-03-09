import { css } from "emotion";

// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderDrawerProps {}
// tslint:disable-next-line:no-empty-interface
export interface IPrescriptionBuilderDrawerState {}

export const createPrescriptionBuilderDrawerClasses = (
    props: IPrescriptionBuilderDrawerProps,
    state: IPrescriptionBuilderDrawerState,
) => {
    const drawerWidth = 320;

    const drawerPaper = css({
        width: drawerWidth,
    });

    const editModeButtonContainer = css({
        display: 'flex',
        justifyContent: 'flex-start',
        padding: 16,
    });

    const drawerInnerContainer = css({
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
    })

    const drawerTitleContainer = css({
        padding: 16,
    });

    const draggableIconsContainer = css({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridGap: 16,
        padding: 16,
        '&::before': {
            content: '""',
            width: 0,
            paddingBottom: '100%',
            gridRow: '1/1',
            gridColumn: '1/1',
        },
        '& *:first-child': {
            gridRow: '1/1',
            gridColumn: '1/1',
        },
        gridAutoRows: '1fr',
    });

    return {
        drawerPaper,
        editModeButtonContainer,
        drawerInnerContainer,
        drawerTitleContainer,
        draggableIconsContainer,
    }
}