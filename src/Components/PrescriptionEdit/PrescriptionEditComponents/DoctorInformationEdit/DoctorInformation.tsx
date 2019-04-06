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

    constructor(props: IDoctorInformationEditProps) {
        super(props);
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

        // hide the doctor search form control if they are the doctor

        const companyId = this.props.location.pathname.split('/')[2];
        const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;

        const doctorExists = !!this.state.selectedDoctorInformation;

        const doctorName = doctorExists ? this.state.selectedDoctorInformation!.fullName : '';
        const street = doctorExists ? this.state.selectedDoctorInformation!.address.street : '';
        const city = doctorExists ? this.state.selectedDoctorInformation!.address.city : '';
        const state = doctorExists ? this.state.selectedDoctorInformation!.address.state : '';
        const zip = doctorExists ? this.state.selectedDoctorInformation!.address.zip : '';
        const telephone = doctorExists ? this.state.selectedDoctorInformation!.telephone : '';

        return (
            <div className={doctorInformationContainer}>
                {userIsDoctor ? undefined : (
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
                <FormControl fullWidth={true} disabled={true}>
                    <InputLabel>Doctor Name</InputLabel>
                    <Input
                        value={doctorName}
                    />
                </FormControl>
                <FormControl fullWidth={true} disabled={true}>
                    <InputLabel>Street</InputLabel>
                    <Input
                        value={street}
                    />
                </FormControl>
                <div className={cityStateZipContainer}>
                    <FormControl disabled={true}>
                        <InputLabel>City</InputLabel>
                        <Input
                            value={city}
                        />
                    </FormControl>
                    <FormControl disabled={true}>
                        <InputLabel>State</InputLabel>
                        <Input
                            value={state}
                        />
                    </FormControl>
                    <FormControl disabled={true}>
                        <InputLabel>Zip</InputLabel>
                        <Input
                            value={zip}
                        />
                    </FormControl>
                </div>
                <FormControl fullWidth={true} disabled={true}>
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
        this.setState({
            doctorSearchValue: doctorSearchName,
        })

        const companyId = this.props.location.pathname.split('/')[2];

        const potentialDoctors = await Api.userApi.searchDoctorUsers(companyId, doctorSearchName);

        this.setState({
            potentialDoctors,
            popperIsOpen: true,
        })
    }

    private selectDoctor = (doctor: IDoctorUser) => () => {
        this.setState({
            selectedDoctorInformation: doctor,
            popperIsOpen: false,
            doctorSearchValue: '',
        })

        const {
            control,
        } = this.props;

        this.props.updateControlValue(control.id, doctor.id);
    }

    // private potentiallySetDoctorUser = () => {
    //     const companyId = this.props.location.pathname.split('/')[2];
    //     const userIsDoctor = this.props.userState[companyId].type === UserType.Doctor;

    //     if (userIsDoctor && ) {
    //         this.setState({

    //         })
    //     }
    // }
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