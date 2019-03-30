import { FormControl, Input, InputAdornment, InputLabel } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { INumberEditProps, INumberEditPropsFromParent, INumberEditState } from './NumberEdit.ias';

export class NumberEditPresentation extends React.Component<INumberEditProps, INumberEditState> {
    public render() {
        const {
            control,
            disabled,
            controlValue,
        } = this.props;

        const value = controlValue || '';

        return (
            <FormControl fullWidth={true} disabled={disabled}>
                <InputLabel htmlFor={`${control.id}-number`}>{control.label}</InputLabel>
                <Input
                    type="number"
                    id={`${control.id}-number`}
                    value={value}
                    onChange={this.handleControlValueChange(control.id)}
                    startAdornment={control.prefix ? <InputAdornment position="start">{control.prefix}</InputAdornment> : undefined}
                    endAdornment={control.suffix ? <InputAdornment position="end">{control.suffix}</InputAdornment> : undefined}
                />
            </FormControl>
        )
    }

    private handleControlValueChange = (controlId: string) => (event: any) => {
        this.props.updateControlValue(controlId, event.target.value);
    }
}

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: INumberEditPropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

export const NumberEdit = connect(undefined, mapDispatchToProps)(NumberEditPresentation);