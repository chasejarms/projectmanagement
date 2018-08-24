import { WithTheme } from '@material-ui/core/';
import { css } from 'emotion';
import * as CssVariables from '../../Styles/variables';

// tslint:disable-next-line:no-empty-interface
export interface IChatProps extends WithTheme {}
// tslint:disable-next-line:no-empty-interface
export interface IChatState {
    message: string;
    messages: any[];
}

export const createChatClasses = (
    props: IChatProps,
    state: IChatState,
) => {
    const chatContainer = css({
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    });
    const messagesContainer = css({
        flexGrow: 1,
        flexShrink: 1,
        marginRight: 40,
        marginLeft: 40,
    });
    const newMessageContainer = css({

        flexBasis: '200px',
        backgroundColor: CssVariables.lightGray,
        display: 'flex',
        flexDirection: 'row',
        padding: '16px',
        position: 'relative',
    });
    const messageInput = css({
        backgroundColor: CssVariables.lightGray,
        border: 'none',
        flexGrow: 1,
        '&:focus': {
            outline: 'none',
        },
    })
    const fabButton = css({
        position: 'absolute',
        top: -30,
        right: 7,
    })
    const formContainer = css({
        display: 'flex',
        flexGrow: 1,
    })

    return {
        chatContainer,
        messagesContainer,
        newMessageContainer,
        messageInput,
        fabButton,
        formContainer,
    };
}