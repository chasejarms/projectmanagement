// import Avatar from '@material-ui/core/Avatar';
import { withTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { withRouter } from 'react-router';
import Api from '../../Api/api';
import { IMessage } from '../../Models/message';
import { handleChange } from '../../Utils/handleChange';
import { Message } from '../Message/Message';
import { createChatClasses, IChatProps, IChatState } from './Chat.ias';

export class ChatPresentation extends React.Component<IChatProps, IChatState> {
    public state: IChatState = {
        message: '',
        messages: [],
    }

    public handleChange = handleChange(this);

    public componentWillMount(): void {
        const projectId = this.props.match.params['projectId'];
        if (this.props.staffChat) {
            const messages = Api.projectsApi.getStaffMessages('does not matter', projectId);
            this.setState({
                messages,
            })
        } else {
            const messages = Api.projectsApi.getCustomerMessages('does not matter', projectId);
            this.setState({
                messages,
            })
        }
    }

    public render() {
        const {
            chatContainer,
            messagesContainer,
            newMessageContainer,
            messageInput,
            fabButton,
            formContainer,
        } = createChatClasses(this.props, this.state);

        const messages = this.state.messages.map((message: IMessage) => {
            return <Message key={message.id} message={message}>{message.content}</Message>
        })

        return (
            <div className={chatContainer}>
                <div className={messagesContainer}>
                    {messages}
                </div>
                <div className={newMessageContainer}>
                    <form className={formContainer}>
                        <Button
                            type="button'"
                            onClick={this.submitMessage}
                            variant="fab"
                            color="secondary"
                            className={fabButton}>
                            <AddIcon/>
                        </Button>
                        <textarea
                            name="message"
                            value={this.state.message}
                            onChange={this.handleChange}
                            onDoubleClick={this.handleDoubleClick}
                            className={messageInput}
                            placeholder="Start typing or double click to add an attachment"/>
                    </form>
                </div>
            </div>
        )
    }

    private submitMessage = (event: any): void => {
        event.preventDefault();
        const message = {
            name: 'Chase Armstrong',
            uid: '123',
            created: new Date(),
            content: this.state.message,
            id: Date.now().toString(),
        }

        const projectId = this.props.match.params['projectId'];
        if (this.props.staffChat) {
            Api.projectsApi.createStaffMessage('does not matter', projectId, message);
        } else {
            Api.projectsApi.createCustomerMessage('does not matter', projectId, message);
        }

        const newMessages = this.state.messages.concat([message]);
        this.setState({
            message: '',
            messages: newMessages,
        })
    }

    private handleDoubleClick = (event: any): void => {
        // tslint:disable-next-line:no-console
        console.log('double click just happened');
    }
}

export const Chat = withRouter(withTheme()(ChatPresentation));