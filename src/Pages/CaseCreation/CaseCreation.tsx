import {
    Paper,
    Toolbar,
    Typography,
    withTheme,
} from '@material-ui/core';
import * as React from 'react';
import { withRouter } from 'react-router';
import { createCaseCreationClasses, ICaseCreationProps, ICaseCreationState } from './CaseCreation.ias';

export class CaseCreationPresentation extends React.Component<
    ICaseCreationProps,
    ICaseCreationState
> {
    public render() {
        const {
            caseCreationContainer,
        } = createCaseCreationClasses(this.props, this.state);

        return (
            <div className={caseCreationContainer}>
                <Paper>
                    <Toolbar>
                        <Typography variant="title">
                            Case Creation Form
                        </Typography>
                    </Toolbar>
                </Paper>
            </div>
        )
    }
}

export const CaseCreation = withRouter(withTheme()(CaseCreationPresentation as any) as any)