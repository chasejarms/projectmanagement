import { WithTheme } from '@material-ui/core';
import { css } from 'emotion';
import { ConnectDropTarget } from 'react-dnd';
import { SectionOrElement } from 'src/Models/sectionOrElement';

export interface IFormElementDropZoneProps extends IFormElementDropZoneDropTargetCollectorProps, WithTheme, IFormElementDropZonePropsFromParentComponent {}

export interface IFormElementDropZonePropsFromParentComponent {
    showBorderWithNoDragInProgress?: boolean;
    text?: string;
    onDrop: (item: any) => void;
    allowSectionOrElement: SectionOrElement;
    heightInPixels: number;
}

// tslint:disable-next-line:no-empty-interface
export interface IFormElementDropZoneState {}

export interface IFormElementDropZoneDropTargetCollectorProps {
    connectDropTarget: ConnectDropTarget;
    isOver: boolean;
    canDrop: boolean;
}

export const createFormElementDropZoneClasses = (
    props: IFormElementDropZoneProps,
    state: IFormElementDropZoneState,
) => {
    const {
        isOver,
        canDrop,
        showBorderWithNoDragInProgress,
    } = props;
    const borderStyle = isOver && canDrop ? 'solid' : canDrop || showBorderWithNoDragInProgress ? 'dashed' : 'solid';
    const borderColor = isOver && canDrop || canDrop || showBorderWithNoDragInProgress ? props.theme.palette.secondary.main : 'transparent';

    const dropTargetClass = css({
        width: '100%',
        height: `${props.heightInPixels}px`,
        border: `2px ${borderStyle} ${borderColor}`,
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