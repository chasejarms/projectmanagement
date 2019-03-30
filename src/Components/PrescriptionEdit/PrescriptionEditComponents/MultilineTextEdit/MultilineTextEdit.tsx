import { TextField } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { IMultilineTextEditProps, IMultilineTextEditPropsFromParent, IMultilineTextEditState } from './MultilineTextEdit.ias';

class MultilineTextEditPresentation extends React.Component<IMultilineTextEditProps, IMultilineTextEditState> {
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
                    rows={5}
                    multiline={true}
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

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: IMultilineTextEditPropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

export const MultilineTextEdit = connect(undefined, mapDispatchToProps)(MultilineTextEditPresentation);