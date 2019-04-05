import { DateFormatInput } from 'material-ui-next-pickers';
import * as React from 'react';
import { connect } from 'react-redux';
import { ICaseDeadlineProps, ICaseDeadlinePropsFromParent, ICaseDeadlineState } from './CaseDeadlineEdit.ias';

export class CaseDeadlineEditPresentation extends React.Component<ICaseDeadlineProps, ICaseDeadlineState> {
    public render() {
        const {
            disabled,
            control,
            controlValue,
        } = this.props;

        return (
            <DateFormatInput
                disabled={disabled}
                fullWidth={true}
                label={control.label}
                name="date-input"
                value={controlValue}
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