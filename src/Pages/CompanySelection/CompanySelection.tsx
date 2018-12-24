import {
    MenuItem,
    Select,
    Typography,
} from '@material-ui/core';
import * as React from 'react';
import Api from '../../Api/api';

import * as firebase from 'firebase';
import { withRouter } from 'react-router';
import { createCompanySelectionPresentationClasses, ICompanySelectionPresentationProps, ICompanySelectionPresentationState } from './CompanySelection.ias';

class CompanySelectionPresentation extends React.Component<ICompanySelectionPresentationProps,ICompanySelectionPresentationState> {
    public state: ICompanySelectionPresentationState = {
        loadingCompanies: true,
        companiesQuerySnapshot: null,
    }

    public componentWillMount(): void {
        firebase.auth().onAuthStateChanged(async(user) => {
            if (user) {
                const companiesQuerySnapshot = await Api.companySelectionApi.getCompaniesForCurrentUser(user.uid);
                this.setState({
                    companiesQuerySnapshot,
                })
            }
        });
    }

    public render() {
        const {
            pageContainer,
        } = createCompanySelectionPresentationClasses(this.props, this.state);

        const template = this.state.companiesQuerySnapshot === null ? <div>Loading</div> : (
            <div className={pageContainer}>
            <Typography variant="headline">Which company would you like to work on?</Typography>
            <Select
                name="newUserRole"
                value={'does not matter'}
                onChange={this.handleCompanySelection}
            >
                {this.state.companiesQuerySnapshot.docs.map((doc) => {
                    return (
                        <MenuItem key={doc.id} value={doc.data().companyId}>
                            {doc.data().companyName}
                        </MenuItem>
                    )
                })}
            </Select>
        </div>
        )

        return template;
    }

    private handleCompanySelection = (event: any) => {
        const companyId = event.target.value;
        this.props.history.push(`/company/${companyId}`)
    }
}

export const CompanySelection = withRouter(CompanySelectionPresentation);