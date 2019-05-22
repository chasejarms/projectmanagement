import {
    Button,
    Paper,
    Typography,
} from '@material-ui/core';
import * as React from 'react';
import { withRouter } from 'react-router';
import {
    createNotFoundClasses,
    INotFoundProps,
    INotFoundState,
} from './NotFound.ias';

// tslint:disable-next-line:no-var-requires
const dentalLabCloseUpSrc = require('./dental-lab-closeup.png');

class NotFoundPresentation extends React.Component<INotFoundProps, INotFoundState> {
    public render() {
        const {
            notFoundPageContainer,
            notFoundPaper,
            notFoundDescription,
            notFoundTitle,
        } = createNotFoundClasses(this.props, this.state);

        return (
            <div className={notFoundPageContainer} style={{
                backgroundImage: `url(${dentalLabCloseUpSrc})`
            }}>
                <Paper className={notFoundPaper}>
                    <Typography variant="h1" className={notFoundTitle}>404</Typography>
                    <Typography variant="subtitle1" className={notFoundDescription}>Sorry, it looks like the page you were searching for doesn't exist or has been moved.</Typography>
                    <Button onClick={this.navigateToHomePage} color="secondary">Home Page</Button>
                </Paper>
            </div>
        )
    }

    private navigateToHomePage = (): void => {
        this.props.history.push('');
    }
}

export const NotFound = withRouter(NotFoundPresentation);