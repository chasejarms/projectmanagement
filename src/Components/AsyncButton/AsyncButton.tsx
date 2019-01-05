import { Button, CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { createAsyncButtonClasses, IAsyncButtonProps, IAsyncButtonState } from './AsyncButton.ias';

export class AsyncButton extends React.Component<IAsyncButtonProps, IAsyncButtonState> {
    constructor(props: IAsyncButtonProps) {
        super(props);
    }

    public render() {
        const {
            materialButton,
            circularProgressContainer,
        } = createAsyncButtonClasses(this.props, this.state);

        const progressOrEmpty = this.props.asyncActionInProgress ? (
            <div className={circularProgressContainer}>
                <CircularProgress
                    color="secondary"
                    size={24}
                    thickness={4}
                />
            </div>
        ) : undefined;

        const {
            asyncActionInProgress,
            ...buttonProps
        } = this.props;
        return (
            <div>
                <Button
                    {...buttonProps}
                    className={`${materialButton} ${this.props.className}`}>
                    {this.props.children}
                    {progressOrEmpty}
                </Button>
            </div>
        )
    }
}