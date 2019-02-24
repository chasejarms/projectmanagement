import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { ConnectDropTarget } from 'react-dnd';

export interface IFormElementDropZoneProps extends IFormElementDropZoneDropTargetCollectorProps, WithTheme, IFormElementDropZonePropsFromParentComponent {}

export interface IFormElementDropZonePropsFromParentComponent {
    showBorderWithNoDragInProgress?: boolean;
    text?: string;
    onDrop: (item: any) => void;
    heightInPixels: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IFormElementDropZoneState {}

export interface IFormElementDropZoneDropTargetCollectorProps {
    connectDropTarget: ConnectDropTarget;
    isOver: boolean;
    dragActionInProgress: boolean;
}

export const createFormElementDropZoneClasses = (
    props: IFormElementDropZoneProps,
    state: IFormElementDropZoneState,
) => {
    const {
        isOver,
        dragActionInProgress,
        showBorderWithNoDragInProgress,
    } = props;
    const borderStyle = isOver ? 'solid' : dragActionInProgress || showBorderWithNoDragInProgress ? 'dashed' : 'transparent';

    const dropTargetClass = css({
        width: '100%',
        height: `${props.heightInPixels}px`,
        border: `2px ${borderStyle} ${props.theme.palette.secondary.main}`,
        marginTop: 2,
        marginBottom: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
    });

    return {
        dropTargetClass,
    };
}