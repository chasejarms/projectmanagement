import { css } from 'emotion';
import { IMessage } from '../../Models/message';
import * as CssVariables from '../../Styles/variables';

// tslint:disable-next-line:no-empty-interface
export interface IMessageProps {
    message: IMessage;
}
// tslint:disable-next-line:no-empty-interface
export interface IMessageState {}

export const createMessageClasses = (
    props: IMessageProps,
    state: IMessageState,
) => {
    const messageContainer = css({
        display: 'flex',
        flexDirection: 'row',
    })
    const avatar = css({
        flexBasis: 'auto',
        flexShrink: 0,
        marginRight: 32,
        boxSizing: 'border-box',
        width: 48,
        height: 48,
    })
    const messageAndNameContainer = css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        paddingTop: 32,
        paddingBottom: 32,
    })
    const dateContainer = css({
        paddingTop: 32,
        flexBasis: 'auto',
    })
    const bodyTypography = css({
        color: CssVariables.charcoal,
    })
    const nameTypography = css({
        paddingBottom: 8,
        letterSpacing: .3,
        color: CssVariables.charcoal,
        fontWeight: 400,
    })
    const nonImageMetadataContainer = css({
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 32,
        flexGrow: 1,
    })
    const dateMessageNameContainer = css({
        display: 'flex',
        flexDirection: 'row',
    })
    const dateTypography = css({
        color: CssVariables.slightlyLightGray,
    });

    const myMessageContainer = css({
        display: 'flex',
        flexDirection: 'row',
    });

    const paper = css({
        padding: 16,
        flexGrow: 1,
        position: 'relative',
        overflow: 'hidden',
    });

    const messageAndArrowContainer = css({
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
        position: 'relative',
    });

    const myMessageArrow = css({
        width: 0,
        height: 0,
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        borderRight: '10px solid #fff',
        position: 'relative',
        right: -2,
        top: 19,
        zIndex: 1,
    });

    const date = css({
        position: 'absolute',
        color: 'white',
        bottom: -23,
        right: 0,
        fontSize: 12,
    });

    return {
        messageContainer,
        avatar,
        messageAndNameContainer,
        dateContainer,
        bodyTypography,
        nameTypography,
        nonImageMetadataContainer,
        dateMessageNameContainer,
        dateTypography,
        myMessageContainer,
        paper,
        myMessageArrow,
        messageAndArrowContainer,
        date,
    }
}