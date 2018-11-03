import * as React from 'react';

import {
    Paper,
    TextField,
    Typography,
} from '@material-ui/core';

import Api from '../../Api/api';
import { createCaseNotesTemplateClasses, ICaseNotesTemplateProps, ICaseNotesTemplateState } from './CaseNotesTemplate.ias';

export class CaseNotesTemplate extends React.Component<ICaseNotesTemplateProps, ICaseNotesTemplateState> {
    public state: ICaseNotesTemplateState = {
        notes: '',
    };

    public componentWillMount = (): void => {
        const caseNotes = Api.caseNotesApi.getCaseNotes('does not matter');
        this.setState({
            notes: caseNotes,
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
        this.setState({
            notes: event.target.value,
        });

        Api.caseNotesApi.updateCaseNotes('does not matter', event.target.value);
    }
}