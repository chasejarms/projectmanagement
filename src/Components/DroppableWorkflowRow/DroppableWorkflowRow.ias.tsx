import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';

// tslint:disable-next-line:no-empty-interface
export interface IDroppableWorkflowRowProps extends WithTheme {
    isOver: boolean;
    connectDropToTarget: any;
}

// tslint:disable-next-line:no-empty-interface
export interface IDroppableWorkflowRowState {
    isHover: boolean;
}

export const createDroppableWorkflowRowClasses = (
    props: IDroppableWorkflowRowProps,
    state: IDroppableWorkflowRowState,
) => {
    const droppableWorkflowRowClass = css({
        height: 15,
        backgroundColor: props.isOver ? props.theme.palette.secondary.light : '',
    });

    const tableDataClass = css({
        position: 'absolute',
        backgroundColor: 'blue',
    });

    const tableDataContainer = css({
        position: 'relative',
    })

    return {
        droppableWorkflowRowClass,
        tableDataClass,
        tableDataContainer,
    }
}