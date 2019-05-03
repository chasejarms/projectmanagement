import {
    FormControl,
    Input,
    InputLabel,
    ListItem,
    MenuItem,
    Paper,
    Popper,
    TextField,
} from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { IDoctorUser } from 'src/Models/doctorUser';
import { UserType } from 'src/Models/userTypes';
import { IAppState } from 'src/Redux/Reducers/rootReducer';
import Api from '../../../../Api/api';
import { createDoctorInformationEditClasses, IDoctorInformationEditProps, IDoctorInformationEditPropsFromParent, IDoctorInformationEditState } from './DoctorInformation.ias';

class DoctorInformationEditPresentation extends React.Component<IDoctorInformationEditProps, IDoctorInformationEditState> {
    public searchInputNode: any;
    public state: IDoctorInformationEditState = {
        doctorSearchValue: '',
        potentialDoctors: [],
        selectedDoctorInformation: null,
        popperIsOpen: false,
    }

    // tslint:disable-next-line:variable-name
    private _isMounted: boolean = true;

    constructor(props: IDoctorInformationEditProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.potentiallySetDoctorUser();
    }

    public componentWillUnmount(): void {
        this._isMounted = false;
    }

    public render() {
        const {
            disabled,
        } = this.props;

        const {
            cityStateZipContainer,
            potentialDoctorsPaper,
            doctorInformationContainer,
        } = createDoctorInformationEditClasses(this.props, this.state);

        const companyId = this.props.location.pathname.split('/')[2];
        const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;

        const doctorExists = !!this.state.selectedDoctorInformation;
        const controlHasValue = !!this.props.controlValue;

        const passedInDoctorExists = !!this.props.existingDoctorInformation;
        const passedInDoctor = this.props.existingDoctorInformation!;

        const doctorName = passedInDoctorExists ? passedInDoctor.fullName : doctorExists && controlHasValue ? this.state.selectedDoctorInformation!.fullName : '';
        const street = passedInDoctorExists ? passedInDoctor.address.street : doctorExists && controlHasValue ? this.state.selectedDoctorInformation!.address.street : '';
        const city = passedInDoctorExists ? passedInDoctor.address.city : doctorExists && controlHasValue ? this.state.selectedDoctorInformation!.address.city : '';
        const state = passedInDoctorExists ? passedInDoctor.address.state : doctorExists && controlHasValue ? this.state.selectedDoctorInformation!.address.state : '';
        const zip = passedInDoctorExists ? passedInDoctor.address.zip : doctorExists && controlHasValue ? this.state.selectedDoctorInformation!.address.zip : '';
        const telephone = passedInDoctorExists ? passedInDoctor.telephone : doctorExists && controlHasValue ? this.state.selectedDoctorInformation!.telephone : '';

        return (
            <div className={doctorInformationContainer}>
                {userIsDoctor || this.props.hideSearch ? undefined : (
                    <TextField
                        placeholder='Search Doctors'
                        fullWidth={true}
                        disabled={disabled}
                        value={this.state.doctorSearchValue}
                        InputProps={{
                            inputRef: (node) => {
                                this.searchInputNode = node;
                            },
                        }}
                        onChange={this.handleDoctorSearch}
                    />
                )}
                <Popper open={this.state.popperIsOpen} anchorEl={this.searchInputNode}>
                    <Paper className={potentialDoctorsPaper} style={{ width: this.searchInputNode ? this.searchInputNode.clientWidth : null }}>
                        {this.state.potentialDoctors.length === 0 ? (
                            <ListItem>
                                No doctors match the specified search.
                            </ListItem>
                        ) : undefined}
                        {this.state.potentialDoctors.map((potentialDoctor) => {
                            return (
                                <MenuItem key={potentialDoctor.id} onClick={this.selectDoctor(potentialDoctor)}>
                                    {potentialDoctor.fullName} ({potentialDoctor.email})
                                </MenuItem>
                            )
                        })}
                    </Paper>
                </Popper>
                <FormControl fullWidth={true} disabled={!this.props.enableNonTouchFields} required={true}>
                    <InputLabel>Doctor Name</InputLabel>
                    <Input
                        value={doctorName}
                    />
                </FormControl>
                <FormControl fullWidth={true} disabled={!this.props.enableNonTouchFields} required={true}>
                    <InputLabel>Street</InputLabel>
                    <Input
                        value={street}
                    />
                </FormControl>
                <div className={cityStateZipContainer}>
                    <FormControl disabled={!this.props.enableNonTouchFields} required={true}>
                        <InputLabel>City</InputLabel>
                        <Input
                            value={city}
                        />
                    </FormControl>
                    <FormControl disabled={!this.props.enableNonTouchFields} required={true}>
                        <InputLabel>State</InputLabel>
                        <Input
                            value={state}
                        />
                    </FormControl>
                    <FormControl disabled={!this.props.enableNonTouchFields} required={true}>
                        <InputLabel>Zip</InputLabel>
                        <Input
                            value={zip}
                        />
                    </FormControl>
                </div>
                <FormControl fullWidth={true} disabled={!this.props.enableNonTouchFields} required={true}>
                    <InputLabel>Telephone</InputLabel>
                    <Input
                        value={telephone}
                    />
                </FormControl>
            </div>
        )
    }

    private handleDoctorSearch = async(event: any) => {
        const doctorSearchName = event.target.value;
        if (this._isMounted) {
            this.setState({
                doctorSearchValue: doctorSearchName,
            })
        }

        const companyId = this.props.location.pathname.split('/')[2];

        const potentialDoctors = await Api.userApi.searchDoctorUsers(companyId, doctorSearchName);

        if (this._isMounted) {
            this.setState({
                potentialDoctors,
                popperIsOpen: true,
            })
        }
    }

    private selectDoctor = (doctor: IDoctorUser) => () => {
        // tslint:disable-next-line:no-console
        console.log('doctor: ', doctor);

        // tslint:disable-next-line:no-console
        console.log('mounted: ', this._isMounted);
        if (this._isMounted) {
            this.setState({
                selectedDoctorInformation: doctor,
                popperIsOpen: false,
                doctorSearchValue: '',
            })
        }

        // tslint:disable-next-line:no-console
        console.log('state: ', this.state);

        const {
            control,
        } = this.props;

        this.props.updateControlValue(control.id, doctor.id);
    }

    private potentiallySetDoctorUser = () => {
        const companyId = this.props.location.pathname.split('/')[2];
        const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;

        if (userIsDoctor) {
            const doctorUser = this.props.userState[companyId] as IDoctorUser;
            this.selectDoctor(doctorUser)();
        }
    }
}

const mapStateToProps = ({ userState }: IAppState) => ({
    userState,
});

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: IDoctorInformationEditPropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

export const DoctorInformationEdit = withRouter(connect(mapStateToProps, mapDispatchToProps)(DoctorInformationEditPresentation as any) as any) as any;