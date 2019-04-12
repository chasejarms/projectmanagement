import { firestore } from 'firebase';
import { DateFormatInput } from 'material-ui-next-pickers';
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

        let updatedControlValue = controlValue;

        if (controlValue instanceof firestore.Timestamp) {
            updatedControlValue = (controlValue as firestore.Timestamp).toDate();
        }

        return (
            <DateFormatInput
                disabled={disabled}
                fullWidth={true}
                label={control.label}
                name="date-input"
                value={updatedControlValue}
                onChange={this.handleDeadlineChange(control.id)}
                min={new Date()}
            />
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