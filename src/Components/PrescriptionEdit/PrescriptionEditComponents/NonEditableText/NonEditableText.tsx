import { Typography } from '@material-ui/core';
import * as React from 'react';
import { INonEditableTextProps, INonEditableTextState } from './NonEditableText.ias';

export class NonEditableText extends React.Component<INonEditableTextProps, INonEditableTextState> {
    public render() {
        const {
            control,
        } = this.props;

        return (
            <Typography variant="subtitle1">{control.text}</Typography>
        )
    }
}