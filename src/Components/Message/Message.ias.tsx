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
        marginTop: 40,
        width: 50,
        height: 50,
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
    })

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
    }
}