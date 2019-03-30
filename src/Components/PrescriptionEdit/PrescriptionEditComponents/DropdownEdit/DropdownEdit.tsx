import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { IDropdownEditProps, IDropdownEditPropsFromParent, IDropdownEditState } from './DropdownEdit.ias';

export class DropdownEditPresentation extends React.Component<IDropdownEditProps, IDropdownEditState> {
    public render() {
        const {
            controlValue,
            disabled,
            control,
        } = this.props;

        const value = controlValue || '';

        return (
            <div>
                <FormControl fullWidth={true} disabled={disabled}>
                    <InputLabel htmlFor={`${control.id}`}>{control.label}</InputLabel>
                    <Select
                        inputProps={{
                            name: control.id,
                            id: control.id,
                        }}
                        value={value}
                        onChange={this.handleControlValueChange(control.id)}
                    >
                        <MenuItem value={''}>No Selection</MenuItem>
                        {control.options.map(({ text, id }) => {
                            return <MenuItem key={id} value={id}>{text}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </div>
        )
    }

    private handleControlValueChange = (controlId: string) => (event: any) => {
        this.props.updateControlValue(controlId, event.target.value);
    }
}

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: IDropdownEditPropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

export const DropdownEdit = connect(undefined, mapDispatchToProps)(DropdownEditPresentation);