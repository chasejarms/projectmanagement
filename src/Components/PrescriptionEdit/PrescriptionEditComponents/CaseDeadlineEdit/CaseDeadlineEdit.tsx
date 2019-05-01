
import { FormControl, Input, InputLabel } from '@material-ui/core';
import { addDays } from 'date-fns';
import { firestore } from 'firebase';
import { DatePicker } from 'material-ui-pickers';
import * as React from 'react';
import { connect } from 'react-redux';
import { ICaseDeadlineProps, ICaseDeadlinePropsFromParent, ICaseDeadlineState } from './CaseDeadlineEdit.ias';

export class CaseDeadlineEditPresentation extends React.Component<ICaseDeadlineProps, ICaseDeadlineState> {
    constructor(props: ICaseDeadlineProps) {
        super(props);
    }

    public componentDidUpdate() {
        const noControlValueExists = this.props.controlValue === undefined || this.props.controlValue === null;
        if (noControlValueExists && !this.props.disabled) {
            const dateControlValue = addDays(new Date(), this.props.control.autofillDays);
            this.props.updateControlValue(this.props.control.id, dateControlValue);
        }
    }

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
                        InputProps={{
                            required: true,
                        }}
                        value={updatedControlValue}
                        label={control.label}
                        disablePast={!disabled}
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

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: ICaseDeadlinePropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

export const CaseDeadlineEdit = connect(undefined, mapDispatchToProps)(CaseDeadlineEditPresentation);