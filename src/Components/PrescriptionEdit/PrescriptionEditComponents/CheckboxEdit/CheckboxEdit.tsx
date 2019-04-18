import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
} from '@material-ui/core';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { createCheckboxEditClasses, ICheckboxEditProps, ICheckboxEditPropsFromParent, ICheckboxEditState } from './CheckboxEdit.ias';

class CheckboxEditPresentation extends React.Component<ICheckboxEditProps, ICheckboxEditState> {
    public render() {
        const {
            control,
            controlValue,
            disabled,
        } = this.props;

        const {
            checkbox,
        } = createCheckboxEditClasses(this.props, this.state);

        return (
            <div>
                <FormControl>
                    <FormGroup row={true}>
                        {control.options.map(({ text, id }) => {
                            const valuesExistForControl = !!controlValue;
                            const checked = valuesExistForControl && !!controlValue[id];

                            return (
                                <FormControlLabel
                                    key={id}
                                    label={text}
                                    onClick={this.handleCheckboxChange(control.id, id)}
                                    control={
                                        <Checkbox value={id} checked={checked} disabled={disabled} className={checkbox}/>
                                    }
                                />
                            )
                        })}
                    </FormGroup>
                </FormControl>
            </div>
        )
    }

    private handleCheckboxChange = (controlId: string, optionId: string) => (event: any) => {
        const {
            disabled,
            controlValue,
        } = this.props;

        if (disabled) {
            return;
        }

        let controlValueCopy = cloneDeep(controlValue);
        const valuesExists = !!controlValueCopy;

        if (valuesExists) {
            const currentValue = controlValueCopy[optionId];
            controlValueCopy[optionId] = !currentValue;
        } else {
            controlValueCopy = {
                [optionId]: true,
            }
        }

        this.props.updateControlValue(controlId, controlValueCopy);
    }
}

const mapDispatchToProps = (dispatch: React.Dispatch<any>, ownProps: ICheckboxEditPropsFromParent) => ({
    updateControlValue: (controlId: string, value: any) => {
        const updateControlValueAction = ownProps.updateControlValueActionCreator(controlId, value);
        dispatch(updateControlValueAction);
    },
})

export const CheckboxEdit = connect(undefined, mapDispatchToProps)(CheckboxEditPresentation);