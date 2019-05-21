import * as React from 'react';
import {
    INotFoundProps,
    INotFoundState,
} from './NotFound.ias';

export class NotFound extends React.Component<INotFoundProps, INotFoundState> {
    public render() {
        return (
            <div>This is the not found page</div>
        )
    }
}