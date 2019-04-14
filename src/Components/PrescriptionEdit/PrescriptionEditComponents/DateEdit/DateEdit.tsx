import { FormControl, Input, InputLabel } from '@material-ui/core';
import { firestore } from 'firebase';
import { DatePicker } from 'material-ui-pickers';
import * as React from 'react';
import { connect } from 'react-redux';
import { IDateEditProps, IDateEditPropsFromParent, IDateEditState } from './DateEdit.ias';

export class DateEditPresentation extends React.Component<IDateEditProps, IDateEditState> {
    public render() {
        const {
            disabled,
            control,
            controlValue,
        } = this.props;

        let updatedControlValue = controlValue === undefined ? null : controlValue;

        if (controlValue instanceof firestore.Timestamp) {
            updatedControlValue = (controlValue as firestore.Timestamp).toDate();
        }

        /*
            Providing two potential options (a form control and a date picker) because
            the date picker swallows up the click event. This becomes an issue in the
            prescription builder when we're trying to click on the disabled component
            in order to toggle to the control configuration options.
        */

        return (
            <div>
                {disabled && !updatedControlValue ? (
                    <FormControl fullWidth={true} disabled={true}>
                        <InputLabel>{control.label}</InputLabel>
                        <Input
                            value={''}
                        />
                    </FormControl>
                ) : (
                    <DatePicker
                        disabled={disabled}
                        fullWidth={true}
                        value={updatedControlValue}
                        label={control.label}
                        disablePast={true}
                        onChange={this.handleDeadlineChange(control.id)}
                    />
                )}
            </div>
        )
    }

    private handleDeadlineChange = (controlId: string) => (newDeadline: any) => {
        this.props.updateControlValue(controlId, newDeadline);
    }
}

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: IDateEditPropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

export const DateEdit = connect(undefined, mapDispatchToProps)(DateEditPresentation);