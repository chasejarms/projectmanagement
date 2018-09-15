import {
    Paper,
} from '@material-ui/core/';
import Avatar from '@material-ui/core/Avatar';
// import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { createMessageClasses, IMessageProps, IMessageState} from './Message.ias';

export class Message extends React.Component<IMessageProps, IMessageState> {
    public render() {
        const {
            // messageContainer,
            // messageAndNameContainer,
            avatar,
            // dateContainer,
            // bodyTypography,
            // nameTypography,
            // nonImageMetadataContainer,
            // dateMessageNameContainer,
            // dateTypography,
            myMessageArrow,
            messageAndArrowContainer,
            myMessageContainer,
            paper,
            date,
        } = createMessageClasses(this.props, this.state);

        const avatarVersionName = this.props.message.name.split(' ').map((name) => {
            return name[0];
        }).join(' ');
        const niceDate = this.prettyPrintDate(this.props.message.created);

            return (
                // <div className={messageContainer}>
                //     <Avatar className={avatar}>{avatarVersionName}</Avatar>
                //     <div className={nonImageMetadataContainer}>
                //         <div className={dateMessageNameContainer}>
                //             <div className={messageAndNameContainer}>
                //                 <Typography variant="title" className={nameTypography}>{this.props.message.name}</Typography>
                //                 <Typography variant="body1" className={bodyTypography}>{this.props.message.content}</Typography>
                //             </div>
                //             <div className={dateContainer}>
                //                 <Typography className={dateTypography}>{niceDate}</Typography>
                //             </div>
                //         </div>
                //         <Divider/>
                //     </div>
                // </div>
                <div className={myMessageContainer}>
                    <Avatar className={avatar}>{avatarVersionName}</Avatar>
                    <div className={messageAndArrowContainer}>
                        <div className={myMessageArrow}/>
                        <Typography variant="body1" className={date}>{niceDate}</Typography>
                        <Paper className={paper}>
                            <Typography variant="body1">{this.props.message.content}</Typography>
                        </Paper>
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