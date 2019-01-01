import * as React from 'react';

import {
    CircularProgress,
    Paper,
    TextField,
    Typography,
} from '@material-ui/core';

import { withRouter } from 'react-router-dom'
import { AsyncButton } from 'src/Components/AsyncButton/AsyncButton';
import Api from '../../Api/api';
import { FormControlState } from '../../Classes/formControlState';
import { createCaseNotesTemplateClasses, ICaseNotesTemplateProps, ICaseNotesTemplateState } from './CaseNotesTemplate.ias';

export class CaseNotesTemplatePresentation extends React.Component<ICaseNotesTemplateProps, ICaseNotesTemplateState> {
    public state: ICaseNotesTemplateState = {
        notes: undefined,
        caseNotesSaveInProgress: false,
    };

    public componentWillMount = (): void => {
        const companyId = this.props.match.path.split('/')[2];
        Api.caseNotesApi.getCaseNotes(companyId).then((caseNotes) => {
            const caseNotesControl = new FormControlState({
                value: caseNotes,
            });
            this.setState({
                notes: caseNotesControl,
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
            loadingPageContainer,
            asyncButtonContainer,
        } = createCaseNotesTemplateClasses(this.props, this.state);

        if (this.state.notes === undefined) {
            return (
                <div className={loadingPageContainer}>
                    <CircularProgress
                        color="secondary"
                        size={64}
                        thickness={3}
                        />
                </div>
            )
        }

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
                        value={this.state.notes!.value}
                        onChange={this.handleCaseNoteChange}
                    />
                    <div className={asyncButtonContainer}>
                        <AsyncButton
                            color="secondary"
                            disabled={this.state.caseNotesSaveInProgress || !this.state.notes!.touched }
                            asyncActionInProgress={this.state.caseNotesSaveInProgress}
                            onClick={this.saveCaseNotes}
                        >
                            Save Case Notes
                        </AsyncButton>
                    </div>
                </Paper>
            </div>
        )
    }

    private handleCaseNoteChange = (event: any): void => {
        this.setState({
            notes: this.state.notes!.setValue(event.target.value),
        });
    }

    private saveCaseNotes = async() => {
        this.setState({
            caseNotesSaveInProgress: true,
        })
        const companyId = this.props.match.path.split('/')[2];
        await Api.caseNotesApi.updateCaseNotes(companyId, this.state.notes!.value);
        this.setState({
            caseNotesSaveInProgress: false,
        })
    }
}

export const CaseNotesTemplate = withRouter(CaseNotesTemplatePresentation);