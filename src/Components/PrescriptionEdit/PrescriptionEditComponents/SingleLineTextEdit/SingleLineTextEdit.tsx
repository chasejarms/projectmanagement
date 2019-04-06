import { TextField } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { ISingleLineTextEditProps, ISingleLineTextEditPropsFromParent, ISingleLineTextEditState } from './SingleLineTextEdit.ias';

export class SingleLineTextEditPresentation extends React.Component<ISingleLineTextEditProps, ISingleLineTextEditState> {
    public render() {
        const {
            disabled,
            control,
            controlValue,
        } = this.props;

        const value = controlValue || '';

        return (
            <div>
                <TextField
                    disabled={disabled}
                    fullWidth={true}
                    label={control.label}
                    value={value}
                    onChange={this.handleControlValueChange(control.id)}
                />
            </div>
        )
    }

    private handleControlValueChange = (controlId: string) => (event: any) => {
        this.props.updateControlValue(controlId, event.target.value);
    }
}

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: ISingleLineTextEditPropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

export const SingleLineTextEdit = connect(undefined, mapDispatchToProps)(SingleLineTextEditPresentation);