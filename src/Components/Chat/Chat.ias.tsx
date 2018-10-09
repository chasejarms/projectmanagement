import { WithTheme } from '@material-ui/core/';
import { css } from 'emotion';
import { RouteComponentProps } from 'react-router';
import * as CssVariables from '../../Styles/variables';

// tslint:disable-next-line:no-empty-interface
export interface IChatProps extends WithTheme, RouteComponentProps<{}> {
    staffChat: boolean;
}
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
        paddingRight: 40,
        paddingLeft: 24,
        overflowY: 'auto',
        display: 'grid',
        gridTemplateRows: '1fr 1fr 1fr',
        gridRowGap: 40,
        paddingTop: 24,
        paddingBottom: 40,
    });
    const newMessageContainer = css({
        boxSizing: 'border-box',
        flexBasis: '200px',
        backgroundColor: CssVariables.lightGray,
        display: 'flex',
        flexDirection: 'row',
        padding: '16px',
        position: 'relative',
        flexShrink: 0,
    });
    const messageInput = css({
        backgroundColor: CssVariables.lightGray,
        border: 'none',
        flexGrow: 1,
        flexShrink: 0,
        '&:focus': {
            outline: 'none',
        },
        fontFamily: props.theme.typography.body1.fontFamily,
        fontSize: props.theme.typography.body1.fontSize,
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