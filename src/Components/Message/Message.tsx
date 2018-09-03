import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { createMessageClasses, IMessageProps, IMessageState} from './Message.ias';

export class Message extends React.Component<IMessageProps, IMessageState> {
    public render() {
        const {
            messageContainer,
            messageAndNameContainer,
            avatar,
            dateContainer,
            bodyTypography,
            nameTypography,
            nonImageMetadataContainer,
            dateMessageNameContainer,
            dateTypography,
        } = createMessageClasses(this.props, this.state);

        const avatarVersionName = this.props.message.name.split(' ').map((name) => {
            return name[0];
        }).join(' ');
        const niceDate = this.prettyPrintDate(this.props.message.created);

            return (
            <div className={messageContainer}>
                <Avatar className={avatar}>{avatarVersionName}</Avatar>
                <div className={nonImageMetadataContainer}>
                    <div className={dateMessageNameContainer}>
                        <div className={messageAndNameContainer}>
                            <Typography variant="title" className={nameTypography}>{this.props.message.name}</Typography>
                            <Typography variant="body1" className={bodyTypography}>{this.props.message.content}</Typography>
                        </div>
                        <div className={dateContainer}>
                            <Typography className={dateTypography}>{niceDate}</Typography>
                        </div>
                    </div>
                    <Divider/>
                </div>
            </div>
        )
    }

    private prettyPrintDate(date: Date): string {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    }
}