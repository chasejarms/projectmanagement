import * as React from 'react';

import {
    Paper,
    TextField,
    Typography,
} from '@material-ui/core';

import { withRouter } from 'react-router-dom'
import Api from '../../Api/api';
import { createCaseNotesTemplateClasses, ICaseNotesTemplateProps, ICaseNotesTemplateState } from './CaseNotesTemplate.ias';

export class CaseNotesTemplatePresentation extends React.Component<ICaseNotesTemplateProps, ICaseNotesTemplateState> {
    public state: ICaseNotesTemplateState = {
        notes: '',
    };

    public componentWillMount = (): void => {
        const companyName = this.props.match.path.split('/')[2];
        Api.caseNotesApi.getCaseNotes(companyName).then((caseNotes) => {
            this.setState({
                notes: caseNotes,
            });
        });
    }

    public render() {
        const {
            caseNotesContainer,
            caseNotesTitle,
            caseNotesPaper,
            caseNotesSubheading,
            caseNotesField,
        } = createCaseNotesTemplateClasses(this.props, this.state);

        return (
            <div className={caseNotesContainer}>
                <Paper className={caseNotesPaper}>
                    <Typography variant="title" className={caseNotesTitle}>Case Notes Template</Typography>
                    <Typography variant="subheading" className={caseNotesSubheading}>
                        The case notes template is what a doctor will first see when they create a case in the system. Use this to get any information you would need about a particular case.
                    </Typography>
                    <TextField
                        className={caseNotesField}
                        rows={10}
                        multiline={true}
                        label="Case Notes"
                        name="notes"
                        value={this.state.notes}
                        onChange={this.handleCaseNoteChange}
                    />
                </Paper>
            </div>
        )
    }

    private handleCaseNoteChange = (event: any): void => {
        const companyName = this.props.match.path.split('/')[2];

        Api.caseNotesApi.updateCaseNotes(companyName, event.target.value);

        this.setState({
            notes: event.target.value,
        });
    }
}

export const CaseNotesTemplate = withRouter(CaseNotesTemplatePresentation);