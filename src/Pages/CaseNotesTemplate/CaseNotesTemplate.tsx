import * as React from 'react';

import {
    Paper,
    Snackbar,
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
        notes: new FormControlState({
            value: '',
        }),
        caseNotesSaveInProgress: false,
        initialLoadInProgress: true,
        caseNotesWereSuccessfullyUpdated: false,
        snackbarIsOpen: false,
    };

    // tslint:disable-next-line:variable-name
    private _isMounted: boolean = true;

    public componentDidMount = (): void => {
        this._isMounted = true;
        const companyId = this.props.match.path.split('/')[2];
        Api.caseNotesApi.getCaseNotes(companyId).then((caseNotes) => {
            const updatedCaseNotesControl = this.state.notes.setValue(caseNotes);
            if (this._isMounted) {
                this.setState({
                    notes: updatedCaseNotesControl,
                    initialLoadInProgress: false,
                });
            }
        });
    }

    public componentWillUnmount = (): void => {
        this._isMounted = false;
    }

    public render() {
        const {
            caseNotesContainer,
            caseNotesTitle,
            caseNotesPaper,
            caseNotesSubheading,
            caseNotesField,
            asyncButtonContainer,
        } = createCaseNotesTemplateClasses(this.props, this.state);

        return (
            <div className={caseNotesContainer}>
                <Paper className={caseNotesPaper}>
                    <Typography variant="title" className={caseNotesTitle}>Case Notes Template</Typography>
                    <Typography variant="subheading" className={caseNotesSubheading}>
                        The case notes template is what a doctor will first see when they create a case in the system. Use this to get any information you would need about a particular case.
                    </Typography>
                    <TextField
                        disabled={this.state.initialLoadInProgress}
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
                            disabled={this.state.caseNotesSaveInProgress || !this.state.notes!.touched || this.state.initialLoadInProgress }
                            asyncActionInProgress={this.state.caseNotesSaveInProgress}
                            onClick={this.saveCaseNotes}
                        >
                            Save Case Notes
                        </AsyncButton>
                    </div>
                </Paper>
                <Snackbar
                    open={this.state.snackbarIsOpen}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    autoHideDuration={5000}
                    message={
                        (
                            <span>
                                {this.state.caseNotesWereSuccessfullyUpdated ? (
                                    'Success! The case notes template was successfully updated.'
                                ): (
                                    'Oops! It looks like there was an error.'
                                )}
                            </span>
                        )
                    }
                    onClose={this.handleSnackbarClose}
                />
            </div>
        )
    }

    private handleSnackbarClose = (): void => {
        this.setState({
            snackbarIsOpen: false,
        })
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
        try {
            await Api.caseNotesApi.updateCaseNotes(companyId, this.state.notes!.value);
        } catch {
            this.setState({
                caseNotesWereSuccessfullyUpdated: false,
                snackbarIsOpen: true,
            })
            return;
        }
        this.setState({
            caseNotesWereSuccessfullyUpdated: true,
            snackbarIsOpen: true,
            caseNotesSaveInProgress: false,
        })
    }
}

export const CaseNotesTemplate = withRouter(CaseNotesTemplatePresentation);