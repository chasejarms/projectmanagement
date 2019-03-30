import { Typography } from '@material-ui/core';
import * as React from 'react';
import { ITitleEditProps, ITitleEditState } from './TitleEdit.ias';

export class TitleEdit extends React.Component<ITitleEditProps, ITitleEditState> {
    public render() {
        return (
            <div>
                <Typography variant="title">{this.props.control.title}</Typography>
            </div>
        )
    }
}