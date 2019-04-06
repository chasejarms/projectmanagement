import { FormControl, Input, InputLabel } from '@material-ui/core';
import * as React from 'react';
import { createDoctorInformationEditClasses, IDoctorInformationEditProps, IDoctorInformationEditState } from './DoctorInformation.ias';

export class DoctorInformationEdit extends React.Component<IDoctorInformationEditProps, IDoctorInformationEditState> {
    public render() {
        const {
            disabled,
        } = this.props;

        const {
            cityStateZipContainer,
        } = createDoctorInformationEditClasses(this.props, this.state);

        return (
            <div>
                <FormControl fullWidth={true} disabled={disabled}>
                    <InputLabel>Doctor</InputLabel>
                    <Input
                        value={''}
                    />
                </FormControl>
                <FormControl fullWidth={true} disabled={disabled}>
                    <InputLabel>Street</InputLabel>
                    <Input
                        value={''}
                    />
                </FormControl>
                <div className={cityStateZipContainer}>
                    <FormControl disabled={disabled}>
                        <InputLabel>City</InputLabel>
                        <Input
                            value={''}
                        />
                    </FormControl>
                    <FormControl disabled={disabled}>
                        <InputLabel>State</InputLabel>
                        <Input
                            value={''}
                        />
                    </FormControl>
                    <FormControl disabled={disabled}>
                        <InputLabel>Zip</InputLabel>
                        <Input
                            value={''}
                        />
                    </FormControl>
                </div>
                <FormControl fullWidth={true} disabled={disabled}>
                    <InputLabel>Telephone</InputLabel>
                    <Input
                        value={''}
                    />
                </FormControl>
            </div>
        )
    }
}