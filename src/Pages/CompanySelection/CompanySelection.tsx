import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@material-ui/core';
import * as React from 'react';
import Api from '../../Api/api';

import { withRouter } from 'react-router';
import { createCompanySelectionPresentationClasses, ICompanySelectionPresentationProps, ICompanySelectionPresentationState } from './CompanySelection.ias';

class CompanySelectionPresentation extends React.Component<ICompanySelectionPresentationProps,ICompanySelectionPresentationState> {
    public state: ICompanySelectionPresentationState = {
        loadingCompanies: true,
        companiesQuerySnapshot: null,
    }

    // tslint:disable-next-line:variable-name
    public _isMounted: boolean;

    public async componentWillMount(): Promise<void> {
        this._isMounted = true;
        const authUserId = this.props.location.search.split('authUserId=')[1];
        // tslint:disable-next-line:no-console
        console.log(authUserId);
        const companiesQuerySnapshot = await Api.companySelectionApi.getCompaniesForCurrentUser(authUserId);
        // tslint:disable-next-line:no-console
        console.log('querySnapshot: ', companiesQuerySnapshot);
        if (companiesQuerySnapshot.size === 1) {
            const onlyCompanyDocumentSnapshot = companiesQuerySnapshot.docs[0];
            const companyId = onlyCompanyDocumentSnapshot.data().companyId;
            this.props.history.push(`/company/${companyId}`);
        } else {
            if (this._isMounted) {
                this.setState({
                    companiesQuerySnapshot,
                })
            }
        }
    }

    public componentWillUnmount(): void {
        this._isMounted = false;
    }

    public render() {
        const {
            pageContainer,
            companySelect,
        } = createCompanySelectionPresentationClasses(this.props, this.state);

        const template = this.state.companiesQuerySnapshot === null ? (
            <div className={pageContainer}>
                <CircularProgress
                    color="primary"
                    size={64}
                    thickness={3}
                />
            </div>
        ) : (
            <div className={pageContainer}>
                <Typography variant="headline">Which company would you like to work on?</Typography>
                <FormControl>
                    <InputLabel>Select A Company</InputLabel>
                    <Select
                        className={companySelect}
                        name="newUserRole"
                        value=''
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
                </FormControl>
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