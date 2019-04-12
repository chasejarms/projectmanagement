import { addDays } from 'date-fns';
import { firestore } from 'firebase';
import { DateFormatInput } from 'material-ui-next-pickers';
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

        let updatedControlValue = controlValue;

        if (controlValue instanceof firestore.Timestamp) {
            updatedControlValue = (controlValue as firestore.Timestamp).toDate();
        }

        return (
            <DateFormatInput
                InputProps={{
                    required: true,
                }}
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

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: ICaseDeadlinePropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

export const CaseDeadlineEdit = connect(undefined, mapDispatchToProps)(CaseDeadlineEditPresentation);